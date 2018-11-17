const { Car, Coordinate, Customer, RectArea } = require('./model.js');

class SimulationState {
    constructor(cars, customers, currentArea) {
        this._id = 1;
        this.cars = cars;
        this.customers = customers;
        this.currentArea = currentArea;
        this.startedAt = new Date();
        this.lastUpdate = new Date();
        this.carPlateCounter = 0;
        this.customerCounter = 0;
        this.lastTrips = [];
    }

    toString() {
        return `SimulationState(lastUpdate: ${this.lastUpdate}, cars: ${this.cars}, customers: ${this.customers}, startedAt: ${this.startedAt})`
    }
}

class Simulation {

    constructor(resources) {
        this.resources = resources;

        this.timerId = null;
        this.carPlateCounter = 0;
        this.customerCounter = 0;

        this.db = resources.mongodb.client.db('application');

        this.updateConfig({
            carsOnMap: 2,
            customersOnMap: 1,
            currentArea: new RectArea(new Coordinate(0, 0), new Coordinate(1000, 500)),
            pricePerKM: 5,
            speed: 1
        });


        
        this.loadState() 
        
    }

    loadState() {
        const db = this.resources.mongodb.client.db('application');
        db.collection('simulationState').find().toArray((err, results) => {
            if (err) {
                throw err;
            }

            if (results.length > 0) {
                const state = results[0];

                // TODO continue loading the state into the current application.
                // I ran out of time here...

                // this.state = new SimulationState(cars, customers, this.currentArea);

                // this.cars = cars;
                // this.customers = customers;
                // this.currentArea = currentArea;
                // this.startedAt = new Date();
                // this.lastUpdate = new Date();
                // this.lastTrips = [];

            }

            console.log(`data loaded: ${results}`)
        });
        
    }

    
    setStepListener(stepCallback) {
        this.stepCallback = stepCallback;
    }

    updateConfig(config) {
        this.carsOnMap = config.carsOnMap;
        this.customersOnMap = config.customersOnMap;
        this.currentArea = config.currentArea;
        this.pricePerKM = config.pricePerKM;
        this.speed = config.speed;

        this.reload();
    }

    reload() {
        console.log('Reloading Simulation');
        this.pause();

        if (this.speed != 0) {
            this.resume();
        }
    }

    start() {
        console.log('Starting simulation');

        this.initializeState();
        this.defineInterval();
    }

    pause() {
        console.log('Pausing the simulation');

        if (this.timerId) {
            clearInterval(this.timerId);
        }

        this.timerId = null;
    }

    resume() {
        console.log('Resuming the simulation');
        this.defineInterval();
    }

    defineInterval() {
        if (this.timerId) {
            clearInterval(this.timerId);
        }

        this.timerId = setInterval(() => {
            this.step();

            if (this.stepCallback) {
                this.stepCallback();
            }

        }, 1000 / this.speed);
    }

    stop() {
        console.log('Stopping the simulation');
        this.pause();

        this.state = null;
    }

    updateCars() {
        const state = this.state;
        const carsOnMap = this.carsOnMap;
        if (carsOnMap != state.cars.length) {
            if (carsOnMap > state.cars.length) {
                const diff =  carsOnMap - state.cars.length;
                for (let i = 0; i < diff; i++) {
                    state.cars.push(this.randomCar());
                }
            } else {
                const diff = state.cars.length - carsOnMap;

                let count = 0;
                for (let i = 0; i < state.cars.length; i++) {
                    const car = state.cars[i];

                    if (car.customer == null) {
                        // removing unused car
                        state.cars.splice(i, 1);
                        count++;
                    }
                    if (count == diff) {
                        break;
                    }
                }
            }
        }
    }

    updateCustomers() {
        const state = this.state;
        const customersOnMap = this.customersOnMap;
        if (customersOnMap != state.customers.length) {
            if (customersOnMap > state.customers.length) {
                const diff =  customersOnMap - state.customers.length;
                for (let i = 0; i < diff; i++) {
                    state.customers.push(this.randomCustomer());
                }
            } else {
                const diff = state.customers.length - customersOnMap;
                
                let count = 0;
                for (let i = 0; i < state.customers.length; i++) {
                    const customer = state.customers[i];

                    if (customer.transportedBy == null) {
                        // removing unused car
                        state.customers.splice(i, 1);
                        count++;
                    }
                    if (count == diff) {
                        break;
                    }
                }
            }
        }
    }

    findCarByCustomer(customer) {
        const cars = this.state.cars;

        const found = cars.filter(car => {
            return (car.customer != null && car.customer.name == customer.name);
        })

        if (found.length == 0) {
            return null;
        }

        return found[0];
    }

    associateCarToWaitingCustomer(availableCustomers, availableCars) {
        if (availableCars.length > 0 && availableCustomers.length > 0) {
            availableCars.forEach(car => {
                if (availableCustomers.length > 0) {
                    const customer = availableCustomers.pop();
                    car.customer = customer;
                    car.fetchingCustomer = true;
                }
            });
        }
    }

    isInBounds(location, destination, tolerance) {
        const x1 = destination.x - tolerance;
        const x2 = destination.x + tolerance;

        const y1 = destination.y - tolerance;
        const y2 = destination.y + tolerance;

        const {x, y} = location;

        const minX = Math.min(x1, x2);
        const minY = Math.min(y1, y2);

        const maxX = Math.max(x1, x2);
        const maxY = Math.max(y1, y2);


        return ((x > minX && x < maxX) && 
            (y > minY && y < maxY));
    }

    calculateNewCoord(destination, location, amount) {
        // there is a need to calculate a better way to go to target here
        // we can make a right-sided triangle here, so
        // using a calculation on a intersection of a point on the
        // hypothenuse would make we obtain the correct x, y.
        const destinationX = destination.x;
        const destinationY = destination.y;

        const locationX = location.x;
        const locationY = location.y;


        const newLocation = new Coordinate(locationX, locationY);
        if (destinationX >= locationX) {
            newLocation.x += amount;
        } else {
            newLocation.x -= amount;
        }
        if (destinationY >= locationY) {
            newLocation.y += amount;
        } else {
            newLocation.y -= amount;
        }

        

        return newLocation;
    }

    stepCar(car) {
        const amount = 20;
        const customer = car.customer;
        const destination = car.fetchingCustomer ? customer.location : customer.destination;

        if (this.isInBounds(car.location, destination, amount)) {
            if (car.fetchingCustomer) {
                car.fetchingCustomer = false;
            } else {
                car.location = destination;
                car.customer = null;
                customer.location = destination;
            }
            
            return;
        }

        car.location = this.calculateNewCoord(destination, car.location, amount);
        // each amount is being considered as a km traveled, this can be changed
        customer.kmTraveled++;

        if (!car.fetchingCustomer) {
            customer.location = car.location;
        }
    }

    step() {
        //console.log(`Process each step of simulation ${new Date()} state: ${this.state}`);

        const state = this.state;
        this.currentArea = state.currentArea; 
        
        this.updateCars();
        this.updateCustomers();
        
        //const pricePerKM = this.pricePerKM;

        const customers = state.customers;
        const cars = state.cars;
        const availableCustomers = customers.filter(customer => {return this.findCarByCustomer(customer) == null});
        const availableCars = cars.filter(car => {return car.customer == null});
        
        this.associateCarToWaitingCustomer(availableCustomers, availableCars);

        const occupiedCars = cars.filter(car => {return car.customer != null});

        occupiedCars.forEach(car => {
            this.stepCar(car);
        })

        for (let i = 0; i < customers.length; i++) {
            const customer = customers[i];
            if (customer.location == customer.destination) {
                state.customers.splice(i, 1);

                const price = customer.kmTraveled * this.pricePerKM;

                state.lastTrips.push(`Trip for '${customer.name}' ended (Cost: \$${price})`)
            }
        }
        
        
        state.lastUpdate = new Date();

        this.saveStateOnDb();
    }

    saveStateOnDb() {
        const db = this.resources.mongodb.client.db('application');
        db.collection('simulationState').save(this.state, (err, result) => {
            if (err) {
                throw err;
            }
        });
    }

    reset() {
        console.log('resetting all states');
    }

    isRunning() {
        return this.timerId != null;
    }

    isStopped() {
        // detect if it is initial state
        return false;
    }

    randomCustomer() {
        return new Customer(this.getRandomCoordinate(this.currentArea), this.getRandomCoordinate(this.currentArea), `John ${this.customerCounter++}`);
    }

    randomCar() {
        return new Car(this.getRandomCoordinate(this.currentArea), null, this.nextCarPlate());
    }

    nextCarPlate() {
        return `CAR${this.carPlateCounter++}`
    }

    initializeState() {
        //read the last state from database

        const cars = [];
        for (let i = 0; i < this.carsOnMap; i++) {
            cars.push(this.randomCar());
        }
        console.log(`initialized cars: ${cars}`)

        const customers = [];
        for (let i = 0; i < this.customersOnMap; i++) {
            customers.push(this.randomCustomer());
        }

        this.state = new SimulationState(cars, customers, this.currentArea);
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRandomCoordinate(area) {
        const minX = Math.min(area.startPoint.x, area.endPoint.x);
        const minY = Math.min(area.startPoint.y, area.endPoint.y);

        const maxX = Math.max(area.startPoint.x, area.endPoint.x);
        const maxY = Math.max(area.startPoint.y, area.endPoint.y);

        return new Coordinate(this.getRandomInt(minX, maxX), this.getRandomInt(minY, maxY));
    }


}

exports.Simulation = Simulation