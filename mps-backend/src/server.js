const server = require('http').createServer();
const io = require('socket.io')();

const { MongoClient } = require('mongodb');
const { Simulation } = require('./simulation.js');

const resources = {};
const port = 8080;

console.log('Starting backend.')
startup(resources);

io.on('connection', (client) => {
    client.on('subscribeToTimer', (interval) => {
        console.log('client is subscribing to timer with interval ', interval);
        
        setInterval(() => {
            client.emit('timer', new Date());
        }, interval);
    });
});


io.listen(port);
console.log(`Listening on port ${port}`)

startSimulation();

console.log('Backend started.')

function startSimulation() {
    const simulation =  new Simulation(resources);
    resources.simulation = simulation;

    simulation.start();
}

function send(res, data, status = 200) {
    res.setHeader('Content-Type', 'application/json');
    res.status(status)
        .send(JSON.stringify(data));
}    

function startup(resources) {
    console.log('Initializing mongodb connection');
    
    MongoClient.connect('mongodb://localhost', {
        useNewUrlParser: true
    }).then((client) => {
        console.log('MongoDB loaded.');
        resources.mongodb = {
            client: client
        };
    }).catch(err => {
        throw err;
    });
}

function isMongoConnected() {
    return ((resources.mongodb && resources.mongodb.client) && true) || false;
}