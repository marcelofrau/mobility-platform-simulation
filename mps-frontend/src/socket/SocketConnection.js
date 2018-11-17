import openSocket from 'socket.io-client';

class SocketConnection {
    constructor() {
        this.socket = openSocket('http://localhost:8080');

        this.socket.on('step', (state) => {
            if (this.stepCallback) {
                this.stepCallback(state);
            }
        });
    }

    getAdminConfig(configCallback) {
        this.socket.on('configChanged', adminConfiguration => {
            console.log(`configChanged: ${adminConfiguration}`)
            configCallback(adminConfiguration)
        });
        this.socket.emit('needConfig')
    }

    setStepCallback(stepCallback) {
        this.stepCallback = stepCallback;
    }
}

export default SocketConnection;