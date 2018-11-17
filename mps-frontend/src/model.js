
class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return `Coordinate(${this.x}, ${this.y})`
    }
}

class Customer {
    constructor(location, destination, name) {
        this.location = location
        this.destination = destination
        this.name = name
    }

    toString() {
        return `Customer(location: ${this.location}, destination: ${this.destination}, name: ${this.name})`
    }
}

class Car {
    constructor(location, customer, carPlate) {
        this.location = location
        this.customer = customer
        this.carPlate = carPlate
    }

    toString() {
        return `Car(location: ${this.location}, customer: ${this.customer}, carPlate: ${this.carPlate})`
    }
}

// initially the are will be only a rectangle, this needs to be changed in the future.
class RectArea {
    constructor(startPoint, endPoint) {
        this.startPoint = startPoint
        this.endPoint = endPoint
    }
    toString() {
        return `RectArea(start: ${this.startPoint}, end: ${this.endPoint})`
    }
}

export { Coordinate, RectArea, Car, Customer}