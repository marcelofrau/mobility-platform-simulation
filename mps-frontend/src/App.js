import React, { Component } from 'react';

import './App.css';

import SocketConnection from './socket/SocketConnection';

class App extends Component {

    constructor() {
        super();

        this.clickFun = this.clickFun.bind(this);
    }

    clickFun() {
        new SocketConnection().subscribeToTimer(timestamp => {
            console.log(`timestamp: ${timestamp}`);
        });
    }

    render() {
        return (
            <div className="App">
                Foo bar <br />
                <button onClick={this.clickFun}>
                    Click Me!
                </button>
            </div>
        );
    }
}

export default App;
