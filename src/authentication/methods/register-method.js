'use strict';
const Boom = require('boom');
const UserModel = require('./../../models/UserModel/userModel');

/**
 * RegisterHandler factory function for the register Route.
 *
 * Use the factory pattern to create hapi route handlers with dependency injection
 * to mock dependencies like Mongoose Models or service calls
 *
 * Example:
 *      server.route( register(registerHandler().handler) );
 *
 * In this example you can swap the actual UserModel with a mock implementation to run e2e tests
 * for api endpoints
 *
 * @returns {{handler: (function(*, *))}}
 */
module.exports = function () {

    /**
     * Creates a new user
     * User is a reference to the mongoose model
     */
    return {
        handler: (request, reply) => {
            let user = new UserModel(request.payload);
            user.save(function (err, user) {
                if(err) {
                    return reply(Boom.badRequest('Cannot create user'));
                } else {
                    return reply({message: 'User Saved Successfully', data: user}).code(201);
                }
            })
        }
    }
};