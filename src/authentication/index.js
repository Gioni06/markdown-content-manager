'use strict';

const AuthHandler = require('./methods/auth-method');
const Auth = require('./routes/auth-post');

const RegisterHandler = require('./methods/register-method');
const Register = require('./routes/register-post');

exports.register = function (server, options, next) {

    server.route(Auth(AuthHandler));
    server.route(Register(RegisterHandler().handler));

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
