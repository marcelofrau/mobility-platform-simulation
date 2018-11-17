import React, { Component } from 'react';

import { Car, Coordinate, Customer, RectArea } from './model.js';

import './App.css';

import SocketConnection from './socket/SocketConnection';

class App extends Component {

    constructor() {
        super();

        this.state = {
            activeCars: 0,
            activeCustomers: 0,
            currentArea: undefined,
            pricePerKM: 0,
            speed: 0
        }

        this.socketConnection = new SocketConnection()
        // .subscribeToTimer(timestamp => {
        //     console.log(`timestamp: ${timestamp}`);
        // });

        this.onChange = this.onChange.bind(this);
        this.updateAdminConfigs = this.updateAdminConfigs.bind(this);

        this.socketConnection.getAdminConfig(this.updateAdminConfigs);
        this.socketConnection.setStepCallback(this.step);
    }

    step(simulationState) {
        console.log(simulationState);
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
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            
            <div className="App">
                <form>
                    <div className="Map">
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
                            <button>Stop</button>
                            <button>Start</button>
                            <button>Pause</button>
                            <button>Resume</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default App;
