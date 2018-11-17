const io = require('socket.io')();

const { MongoClient } = require('mongodb');
const { Simulation } = require('./simulation.js');

const resources = {};
const port = 8080;

console.log('Starting backend.')
startup(resources);

const simulation =  new Simulation(resources);
resources.simulation = simulation;

simulation.start();

simulation.setStepListener(() => {
    io.emit('step', simulation.state);
})

io.on('connection', (socket) => {

    const simulation = resources.simulation;

    socket.on('needConfig', () => {
        
        const adminConfiguration = {
            activeCars: simulation.carsOnMap,
            activeCustomers: simulation.customersOnMap,
            currentArea: simulation.currentArea,
            pricePerKM: simulation.pricePerKM,
            speed: simulation.speed,
            isRunning: simulation.isRunning(),
            isStopped: simulation.isStopped()
        }
        socket.emit('configChanged', adminConfiguration);
    });

    socket.on('updateConfig', (adminConfiguration) => {
        simulation.updateConfig({
            carsOnMap: adminConfiguration.activeCars,
            customersOnMap: adminConfiguration.activeCustomers,
            pricePerKM: adminConfiguration.pricePerKM,
            //currentArea: adminConfiguration.currentArea,
            speed: adminConfiguration.speed
        });
        
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