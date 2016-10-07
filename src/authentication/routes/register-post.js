'use strict';

const Joi = require('joi');

module.exports = (handler) => {

    return {
        method: 'POST',
        path: '/register',
        config: {
            auth: false,
            handler,
            validate: {
                payload: {
                    email: Joi.string().email().required(),
                    password: Joi.string().required()
                }
            },
            description: 'Register a user',
            notes: '....',
            tags: ['api', 'User']
        }
    };
};
