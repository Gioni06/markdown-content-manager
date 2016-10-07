'use strict';
const Boom = require('boom');
const UserModel = require('./../../models/UserModel/userModel');

/**
 * RegisterHandler factory function for the Register Route.
 *
 * Use the factory pattern to create hapi route handlers with dependency injection
 * to mock dependencies like Mongoose Models or service calls
 *
 * Example:
 *      server.route( Register(RegisterHandler().handler) );
 *
 * In this example you can swap the actual UserModel with a mock implementation to run e2e tests
 * for api endpoints
 *
 * @returns {{handler: (function(*, *))}}
 */
module.exports = function () {

    /**
     * Creates a new user
     * User is a reference to the Mongoose model
     */
    return {
        handler: (request, reply) => {

            const User = new UserModel(request.payload);
            User.saveUser((err, user) => {

                if (err) {
                    if (err.message === 'User already exists') {
                        return reply(Boom.notAcceptable('User already exists'));
                    }
                    return reply(Boom.badRequest('Cannot create user'));
                }
                return reply({ message: 'User Saved Successfully', data: user }).code(201);
            });
        }
    };
};
