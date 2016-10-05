'use strict';

const authHandler = require('./methods/auth-method');
const auth = require('./routes/auth-post');

const registerHandler = require('./methods/register-method');
const register = require('./routes/register-post');

exports.register = function (server, options, next) {

    server.route(auth(authHandler));
    server.route(register(registerHandler().handler));
    server.route({
        method: 'GET',
        path: '/test',
        handler: function(request, reply) {
            reply('hello');
        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};