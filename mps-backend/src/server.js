const io = require('socket.io')();

const { MongoClient } = require('mongodb');
const { Simulation } = require('./simulation.js');

const resources = {};
const port = 8080;

console.log('Starting backend.')
startup(resources);


io.on('connection', (socket) => {

    const simulation = resources.simulation;

    socket.on('needConfig', () => {
        socket.emit('configChanged', simulation.config);
    });

    socket.on('updateConfig', (adminConfiguration) => {
        simulation.updateConfig(adminConfiguration);

        // this will broadcast to all connections that the configurations was changed
        io.emit('configChanged', adminConfiguration);
    })

    socket.on('start', () => {
        simulation.start();
    });

    socket.on('pause', () => {
        simulation.pause();
    })

    socket.on('resume', () => {
        simulation.resume();
    })

    socket.on('stop', () => {
        simulation.stop();
    })

});



io.listen(port);
console.log(`Listening on port ${port}`)

console.log('Backend started.')

function startSimulation(resources) {
    const simulation =  new Simulation(resources);

    resources.simulation = simulation;

    simulation.setStepListener(() => {
        io.emit('step', simulation.state);
    })

    simulation.start();
}

function startup(resources) {
    console.log('Initializing mongodb connection');

    MongoClient.connect('mongodb://localhost', {
        useNewUrlParser: true
    }).then((client) => {
        console.log('MongoDB loaded.');
        
        resources.mongodb = {
            // storing the client of mongodb into resources for later usage.
            client: client
        };

        startSimulation(resources);
    }).catch(err => {
        console.log(`Unable to start MongoDB, ignoring data storage. ${err}`);

        resources.mongodb = null;
        startSimulation(resources);
    });
}
