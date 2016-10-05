'use strict';

const Joi = require('joi');

module.exports = function (handler) {
    return {
        method: 'POST',
        path: "/auth",
        config: {
            auth: false,
            handler: handler,
            validate: {
                payload: {
                    email: Joi.string().required(),
                    password: Joi.string().required()
                }
            },
            description: 'Login and get authorization token',
            notes: '....',
            tags: ['api', 'User'],
        }
    }
};