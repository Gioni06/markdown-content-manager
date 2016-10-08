'use strict';
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const HapiAuthJWT = require('hapi-auth-jwt2'); // http://git.io/vT5dZ
const Validate = require('./services/validateTokenFn');
const ValidateContentDeliveryFn = require('./services/validateContentDeliveryToken');
const Mongoose = require('mongoose');
const JWT_SECRET = process.env.JWT_SECRET;
const Config = require('./../app/loadConfig');
const config = Config.loadConfig(process.env.environment || 'development');
const HapiOptions = require('./../config/hapi-options');
Mongoose.connect('mongodb://root:root123@database:27017/markdown');

// Create a server with a host and port
const server = new Hapi.Server({
    debug: {
        log: 'errors'
    }
});

server.connection(config.server.connection);

const hapiPlugins = [
    HapiAuthJWT,
    Inert,
    Vision,
    require('./authentication'),
    require('./authentication-key'),
    require('./documents'),
    {
        register: HapiSwagger,
        options: HapiOptions
    }
];

server.register(hapiPlugins, (err) => {

    if (err) {
        throw err;
    }

    server.auth.strategy('jwt', 'jwt',
        {
            key: JWT_SECRET,
            validateFunc: Validate,
            verifyOptions: { algorithms: ['HS256'], ignoreExpiration: true }
        });

    server.auth.strategy('contentDelivery', 'contentDelivery',
        {
            tokenName: 'content_token',
            validateFunc: ValidateContentDeliveryFn
        });

});

module.exports = server;
