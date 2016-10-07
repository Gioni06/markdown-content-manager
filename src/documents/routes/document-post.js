'use strict';

const Joi = require('joi');

module.exports = (handler) => {

    return {
        method: 'POST',
        path: '/document',
        config: {
            auth: 'jwt',
            handler,
            validate: {
                payload: {
                    body: Joi.string().required()
                }
            },
            description: 'Creates a new document',
            notes: '....',
            tags: ['api', 'document']
        }
    };
};
