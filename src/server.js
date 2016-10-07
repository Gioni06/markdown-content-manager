'use strict';
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Joi = require('joi');
const HapiSwagger = require('hapi-swagger');
const HapiAuthJWT = require('hapi-auth-jwt2'); // http://git.io/vT5dZ
const Validate = require('./services/validateTokenFn');
const Mongoose = require('mongoose');
const JWT_SECRET = process.env.JWT_SECRET;
const Config = require('./../app/loadConfig');
const config = Config.loadConfig(process.env.environment || 'development');
const HapiOptions = require('./../config/hapi-options');
Mongoose.connect('mongodb://root:root123@database:27017/markdown');

// Create a server with a host and port
const server = new Hapi.Server();

server.connection(config.server.connection);

const hapiPlugins = [
    require('./authentication'),
    HapiAuthJWT,
    Inert,
    Vision,
    {
        register: HapiSwagger,
        options: HapiOptions
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
            validateFunc: Validate,
            verifyOptions: { algorithms: ['HS256'], ignoreExpiration: false }
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
