'use strict';
const Pack = require('./package.json');
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Joi = require('joi');
const HapiSwagger = require('hapi-swagger');
const RESPONSE_TYPES = require('./const/response-types');

// Create a server with a host and port
const server = new Hapi.Server();

server.connection({
    host: '0.0.0.0',
    port: 9000
});

const options = {
    info: {
        'title': 'Markdown Content Server Documentation',
        'version': Pack.version,
        contact: {
            'name': 'Jonas Duri',
            'email': 'jonas.duri@gmail.com'
        }
    },
    securityDefinitions: {
        'jwt': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header',
            'placeholder': 'API Key'
        }
    },
    tags: [
        {
            name: 'Welcome',
            description: 'Basic welcome message'
        },
        {
            name : 'User',
            description: 'A more personal welcome message'
        }
    ],
    schemes: ['http'],
    host: 'localhost:8080',
    jsonEditor: true,
    sortTags: 'name',
    sortEndpoints: 'path'
};

const hapiPlugins = [
    Inert,
    Vision,
    {
        register: HapiSwagger,
        options: options
    }
];

const jsonResponseSchema = Joi.object({
    status: Joi.number().required(),
    message: Joi.string().required(),
    data: Joi.object({data: '...'})
});

/**
 * Welcome route
 */
server.route({
    method: 'GET',
    path:'/welcome',
    config: {
        handler: function (request, reply) {
            const welcomeMessage = {
                status: 200,
                message: 'Ok',
                data: {
                    data: `Welcome anonymous`
                }
            };

            return reply(welcomeMessage)
                .type(RESPONSE_TYPES.JSON)
                .header('X-Author', 'Jonas Duri');
        },
        response: {
            schema: jsonResponseSchema
        },
        description: 'Get a friendly welcome message',
        notes: 'You can pass your name as a parameter',
        tags: ['api','Welcome'],
    }
});

server.route({
    method: 'GET',
    path:'/user/welcome/{name}',
    config: {
        handler: function (request, reply) {
            const welcomeMessage = {
                status: 200,
                message: 'Ok',
                data: {
                    data: `Welcome ${request.params.name}`
                }
            };

            return reply(welcomeMessage)
                .type(RESPONSE_TYPES.JSON)
                .header('X-Author', 'Jonas Duri');
        },
        response: {
            schema: jsonResponseSchema
        },
        description: 'Get a friendly welcome message',
        notes: 'See the welcome message',
        tags: ['api','User'],
        validate: {
            params: {
                name: Joi.string().required()
            },
        }
    }
});

server.register(hapiPlugins, function (err) {
    if(err) {
        throw err;
    }

    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
