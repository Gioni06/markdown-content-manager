'use strict';

const Joi = require('joi');

module.exports = function(handler) {
    return {
        method: 'POST',
        path: "/register",
        config: {
            auth: false,
            handler: handler,
            validate: {
                payload: {
                    email: Joi.string().email().required(),
                    password: Joi.string().required()
                }
            },
            response: {
                schema: Joi.object({
                    message: Joi.string().required(),
                    data: Joi.object()
                })
            },
            description: 'Register a user',
            notes: '....',
            tags: ['api', 'User'],
        }
    }
};