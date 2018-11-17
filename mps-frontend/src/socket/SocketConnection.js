import openSocket from 'socket.io-client';

class SocketConnection {

    constructor() {
        this.socket = openSocket('http://localhost:8080');
    }

    subscribeToTimer(callback) {
        this.socket.on('timer', timestamp => callback(timestamp));
        this.socket.emit('subscribeToTimer', 1000);
    }

}

export default SocketConnection;