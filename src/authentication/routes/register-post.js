'use strict';

const Joi = require('joi');

module.exports = (handler) => {

    return {
        method: 'POST',
        path: '/Register',
        config: {
            auth: false,
            handler,
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
            tags: ['api', 'User']
        }
    };
};
