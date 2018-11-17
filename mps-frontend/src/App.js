import React, { Component } from 'react';
import './App.css';

import SocketConnection from './socket/SocketConnection';

class App extends Component {

    constructor() {
        super();

        this.state = {
            activeCars: 0,
            activeCustomers: 0,
            pricePerKM: 0,
            speed: 0,
            simulationState: null
        }
        
        this.onChange = this.onChange.bind(this);
        this.step = this.step.bind(this);
        this.stop = this.stop.bind(this);
        this.start = this.start.bind(this);
        this.resume = this.resume.bind(this);
        this.pause = this.pause.bind(this);
        this.plotCars = this.plotCars.bind(this);
        this.plotCustomers = this.plotCustomers.bind(this);
        this.showInfo = this.showInfo.bind(this);
        this.updateAdminConfigs = this.updateAdminConfigs.bind(this);

        this.socketConnection = new SocketConnection()
        this.socketConnection.getAdminConfig(this.updateAdminConfigs);
        this.socketConnection.setStepCallback(this.step);
    }

    step(simulationState) {
        this.setState({
            simulationState: simulationState
        })
    }

    stop() {
        this.socketConnection.stop();
    }

    start() {
        this.socketConnection.start();
    }

    pause() {
        this.socketConnection.pause();
    }

    resume() {
        this.socketConnection.resume();
    }

    updateAdminConfigs(adminConfiguration) {
        this.setState({
            activeCars: adminConfiguration.activeCars,
            activeCustomers: adminConfiguration.activeCustomers,
            currentArea: adminConfiguration.currentArea,
            pricePerKM: adminConfiguration.pricePerKM,
            speed: adminConfiguration.speed
        })
    }

    

    onChange(event) {
        const state = this.state;
        state[event.target.name] = event.target.value;

        // this will cause the setState to be called with new values
        // so the changes will go to the backend and backend
        // will return the new values on the updateAdminConfigs method.
        this.socketConnection.setAdminConfig({
            activeCars: this.state.activeCars,
            activeCustomers: this.state.activeCustomers,
            currentArea: this.state.currentArea,
            pricePerKM: this.state.pricePerKM,
            speed: this.state.speed
        });
    }

    getMapStyle() {
        const simState = this.state.simulationState;

        if (simState) {
            const area = simState.currentArea;
            
            const minX = Math.min(area.startPoint.x, area.endPoint.x);
            const minY = Math.min(area.startPoint.y, area.endPoint.y);
    
            const maxX = Math.max(area.startPoint.x, area.endPoint.x);
            const maxY = Math.max(area.startPoint.y, area.endPoint.y);

            const width = (maxX - minX) + 50;
            const height = (maxY - minY) + 50;

            return {
                width: `${width}px`,
                height: `${height}px`,
            }
        }

        return {};
    }

    plotCars() {
        if (!this.state.simulationState) {
            return
        }

        return this.state.simulationState.cars.map(car => {
            const location = car.location;

            return (
                <div key={car.carPlate} className="car" style={{
                    position: "absolute",
                    top: `${location.y}px`,
                    left: `${location.x}px`,
                }}>
                    <i className="fas fa-car-side fa-2x"></i>
                    <div>
                        {car.carPlate}
                    </div>
                </div>
            );
        }) 
    }

    plotCustomers() {
        if (!this.state.simulationState) {
            return
        }

        return this.state.simulationState.customers.map(customer => {
            const location = customer.location;
            const destination = customer.destination;

            return (
                <div key={customer.name}>
                    <div className="customer" style={{
                        position: "absolute",
                        top: `${location.y}px`,
                        left: `${location.x}px`,
                    }}>
                        <div>{customer.name}</div>
                        <i className="fas fa-male fa-2x"></i>
                    </div>
                    <div className="customer" style={{
                        position: "absolute",
                        top: `${destination.y}px`,
                        left: `${destination.x}px`,
                    }}>
                        <div>{customer.name}</div>
                        <i className="far fa-dot-circle"></i>
                    </div>
                </div>
            );
        }) 

        
    }

    lastRides() {
        const trips = this.state.simulationState.lastTrips;
        
        const htmlTrips = [];

        for (let i = trips.length - 5; i < trips.length; i++) {
            htmlTrips.push((<div>{trips[i]}</div>))
        }

        return htmlTrips;
    }

    showInfo() {
        if (!this.state.simulationState) {
            return
        }
        
        return <div className="info">
            <div className="lastUpdate">Updated on: {this.state.simulationState.lastUpdate}</div>
            <div className="lastRides">Last 5 trips summary: {this.lastRides()}</div>
        </div>
    }

    render() {
        const mapStyle = this.getMapStyle();
        
        return (
            
            <div className="App">
                <form>
                    <div className="Map" style={mapStyle}>
                        {this.showInfo()}
                        {this.plotCars()}
                        {this.plotCustomers()}
                    </div>
                    <div className="Config">
                        <div className="form">
                            <div>
                                <label htmlFor="activeCars">Active Cars</label>
                                <input type="number" id="activeCars" name="activeCars" value={this.state.activeCars} onChange={this.onChange}/>
                            </div>
                            <div>
                                <label htmlFor="activeCustomers">Active Customers</label>
                                <input type="number" id="activeCustomers" name="activeCustomers" value={this.state.activeCustomers} onChange={this.onChange}/>
                            </div>
                            <div>
                                <label htmlFor="pricePerKM">Price per KM</label>
                                <input type="number" id="pricePerKM" name="pricePerKM" value={this.state.pricePerKM} onChange={this.onChange}/>
                            </div>
                            <div>
                                <label htmlFor="speed">Speed</label>
                                <input type="number" id="speed" name="speed" value={this.state.speed} onChange={this.onChange}/>
                            </div>
                        </div>

                        {/* TODO: allow change the area here */}
                        <div className="buttons">
                            <button onClick={ _ => this.stop() }>stop</button>
                            <button onClick={ _ => this.start() }>start</button>
                            <button onClick={ _ => this.pause() }>pause</button>
                            <button onClick={ _ => this.resume() }>resume</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
  
  

export default App;
