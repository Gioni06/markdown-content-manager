'use strict';

const Hapi = require('hapi');
const RESPONSE_TYPES = require('./const/response-types');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: '0.0.0.0',
    port: 9000
});

// Add the route
server.route({
    method: 'GET',
    path:'/',
    handler: function (request, reply) {
        let welcomeMessage = {
            status: 200,
            message: 'Ok',
            data: {
                data: 'Hello from hapi'
            }
        };

        return reply(welcomeMessage)
            .type(RESPONSE_TYPES.JSON)
            .header('X-Author', 'Jonas Duri');
    }
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});