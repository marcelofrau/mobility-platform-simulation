const { Car, Coordinate, Customer, RectArea } = require('./model.js');

class SimulationState {
    constructor(availableCars, currentCustomers, currentArea) {
        this.availableCars = availableCars;
        this.currentCustomers = currentCustomers;
        this.currentArea = currentArea;
    }

    toString() {
        return `SimulationState(availableCars: ${this.availableCars}, currentCustomers: ${this.currentCustomers})`
    }
}

class Simulation {

    constructor(resources) {
        this.resources = resources;

        this.timerId = null;

        // retrieve this data from the database.
        this.updateConfig({
            carsOnMap: 2,
            customersOnMap: 1,
            currentArea: new RectArea(new Coordinate(0, 0), new Coordinate(100, 100)),
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
        console.log('reloading');

        this.pause();
        this.resume();
    }

    start() {
        console.log('Starting simulation');
        // console.log(new Coordinate(10, 10));

        this.initializeState();
        this.defineInterval();
    }

    pause() {
        console.log('Pausing the simulation');

        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    resume() {

        // if (this.state == null) {
        //     throw 'Unable to resume. The simulation was stopped';
        // }

        if (!this.timerId) {
            return; //is not paused
        }

        console.log('Resuming the simulation');
        this.defineInterval();
    }

    defineInterval() {
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

    step() {
        console.log(`Process each step of simulation ${new Date()} state: ${this.state}`);

        const state = this.state;



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

    initializeState() {
        //read the last state from database

        const cars = [];
        for (let i = 0; i < this.carsOnMap; i++) {
            cars.push(new Car(this.getRandomCoordinate(), null, `PLT00${i}`));
        }

        const customers = [];
        for (let i = 0; i < this.customersOnMap; i++) {
            cars.push(new Customer(this.getRandomCoordinate(), this.getRandomCoordinate(), `John ${i}`));
        }

        this.state = new SimulationState(cars, customers, this.currentArea);
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRandomCoordinate() {
        const area = this.currentArea;

        const minX = Math.min(area.startPoint.x, area.endPoint.x);
        const minY = Math.min(area.startPoint.y, area.endPoint.y);

        const maxX = Math.max(area.startPoint.x, area.endPoint.x);
        const maxY = Math.max(area.startPoint.y, area.endPoint.y);

        return new Coordinate(this.getRandomInt(minX, maxX), this.getRandomInt(minY, maxY));
    }


}

exports.Simulation = Simulation