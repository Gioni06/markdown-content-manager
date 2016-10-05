'use strict';
const Pack = require('./../package.json');
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Joi = require('joi');
const HapiSwagger = require('hapi-swagger');
const HapiAuthJWT = require('hapi-auth-jwt2'); // http://git.io/vT5dZ
const RedisService = require('./services/RedisService');
const Mongoose = require('mongoose');
const JWT_SECRET = process.env.JWT_SECRET;

Mongoose.connect('mongodb://root:root123@database:27017/markdown');

const validate = (decoded, request, callback) => {

    RedisService.get(decoded.id, (error, response) => {

        if (error) {
            server.log(error);
        }

        let session;

        if (response) {
            session = JSON.parse(response);
        }
        else {
            return callback(error, false);
        }

        if (session.valid !== true) {
            return callback(error, false);
        }

        return callback(error, true);
    });

};

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
    require('./authentication'),
    HapiAuthJWT,
    Inert,
    Vision,
    {
        register: HapiSwagger,
        options
    }
];

const jsonResponseSchema = Joi.object({
    status: Joi.number().required(),
    message: Joi.string().required(),
    data: Joi.object()
});


server.register(hapiPlugins, (err) => {

    if (err) {
        throw err;
    }

    server.auth.strategy('jwt', 'jwt',
        {
            key: JWT_SECRET,
            validateFunc: validate,
            verifyOptions: { algorithms: ['HS256'], ignoreExpiration: true }
        });

    server.route({
        method: 'GET',
        path:'/welcome',
        config: {
            handler: (request, reply) => {

                const welcomeMessage = {
                    status: 200,
                    message: 'Ok',
                    data: {
                        data: 'Welcome anonymous'
                    }
                };

                return reply(welcomeMessage)
                    .type('Application/JSON')
                    .header('X-Author', 'Jonas Duri');
            },
            response: {
                schema: jsonResponseSchema
            },
            description: 'Get a friendly welcome message',
            notes: 'You can pass your name as a parameter',
            tags: ['api','Welcome']
        }
    });

    server.route({
        method: 'GET',
        path:'/user/welcome/{name}',
        config: {
            auth: 'jwt',
            handler: (request, reply) => {

                const welcomeMessage = {
                    status: 200,
                    message: 'Ok',
                    data: {
                        data: `Welcome ${request.params.name}`
                    }
                };

                return reply(welcomeMessage)
                    .type('Application/JSON')
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
                }
            }
        }
    });
});

module.exports = server;
