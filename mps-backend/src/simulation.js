const { Car, Coordinate, Customer, RectArea } = require('./model.js');

class SimulationState {
    constructor(availableCars, availableCustomers, currentArea) {
        this.availableCars = availableCars;
        this.availableCustomers = availableCustomers;
        this.currentArea = currentArea;
        this.startedAt = new Date();
        this.lastUpdate = new Date();
    }

    toString() {
        return `SimulationState(lastUpdate: ${this.lastUpdate}, availableCars: ${this.availableCars}, availableCustomers: ${this.availableCustomers}, startedAt: ${this.startedAt})`
    }
}

class Simulation {

    constructor(resources) {
        this.resources = resources;

        this.timerId = null;
        this.carPlateCounter = 0;
        this.customerCounter = 0;

        // retrieve this data from the database.
        this.updateConfig({
            carsOnMap: 2,
            customersOnMap: 1,
            currentArea: new RectArea(new Coordinate(0, 0), new Coordinate(1000, 500)),
            pricePerKM: 5,
            speed: 1
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
        if (carsOnMap != state.availableCars.length) {
            if (carsOnMap > state.availableCars.length) {
                const diff =  carsOnMap - state.availableCars.length;
                for (let i = 0; i < diff; i++) {
                    state.availableCars.push(this.randomCar());
                }
            } else {
                const diff = state.availableCars.length - carsOnMap;

                let count = 0;
                for (let i = 0; i < state.availableCars.length; i++) {
                    const car = state.availableCars[i];

                    if (car.customer == null) {
                        // removing unused car
                        state.availableCars.splice(i, 1);
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
        if (customersOnMap != state.availableCustomers.length) {
            if (customersOnMap > state.availableCustomers.length) {
                const diff =  customersOnMap - state.availableCustomers.length;
                for (let i = 0; i < diff; i++) {
                    state.availableCustomers.push(this.randomCustomer());
                }
            } else {
                const diff = state.availableCustomers.length - customersOnMap;
                
                let count = 0;
                for (let i = 0; i < state.availableCustomers.length; i++) {
                    const customer = state.availableCustomers[i];

                    if (customer.transportedBy == null) {
                        // removing unused car
                        state.availableCustomers.splice(i, 1);
                        count++;
                    }
                    if (count == diff) {
                        break;
                    }
                }
            }
        }
    }

    step() {
        //console.log(`Process each step of simulation ${new Date()} state: ${this.state}`);

        const state = this.state;
        this.currentArea = state.currentArea; 
        
        this.updateCars();
        this.updateCustomers();
        
        const pricePerKM = this.pricePerKM;


        //console.log(`step: ${state.lastUpdate}, speed: ${this.speed}`)
        console.log(`step: ${state.lastUpdate}, cars: ${this.carsOnMap}, carsState: ${state.availableCars.length}`)

        

        state.lastUpdate = new Date();
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