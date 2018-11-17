const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');

const resources = {};

console.log('Starting backend.')
startup(resources);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
});

app.get('/', (req, res) => {
    send(res, {
        message: 'Hello World',
        mongodb: {
            connected: isMongoConnected()
        }
    });
});

app.listen(8080, () => console.log('Listening on 8080 port'));

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