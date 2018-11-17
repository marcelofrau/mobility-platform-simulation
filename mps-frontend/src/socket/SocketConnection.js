import openSocket from 'socket.io-client';

class SocketConnection {
    constructor() {
        this.socket = openSocket('http://localhost:8080');
    }

    getAdminConfig(configCallback) {
        this.socket.on('configChanged', adminConfiguration => {
            console.log(`configChanged: ${adminConfiguration}`)
            configCallback(adminConfiguration)
        });
        this.socket.emit('needConfig')
    }

    subscribeToTimer(callback) {
        this.socket.on('timer', timestamp => callback(timestamp));

        this.socket.emit('subscribeToTimer', 1000);
    }
}

export default SocketConnection;