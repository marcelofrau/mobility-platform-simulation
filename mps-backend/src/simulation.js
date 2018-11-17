const { Car, Coordinate, Customer, RectArea } = require('./model.js');

class Simulation {

    constructor(resources) {
        this.resources = resources;
        this.carsOnMap = 10;
        this.customersOnMap = 10;
        this.currentArea = new RectArea(new Coordinate(0, 0), new Coordinate(100, 100));
        this.pricePerKM = 5.0;

    }

    start() {
        console.log('Starting simulation');
        console.log(new Coordinate(10, 10));
    }

    pause() {
        console.log('Pausing the simulation');
    }

    resume() {
        console.log('Resuming the simulation')
    }

    stop() {
        console.log('Stopping the simulation');
    }

    step() {
        console.log('Process each step of simulation');
    }

}

exports.Simulation = Simulation