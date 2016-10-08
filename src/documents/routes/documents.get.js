'use strict';

const Joi = require('joi');

module.exports = (handler) => {

    return {
        method: 'GET',
        path: '/documents',
        config: {
            auth: 'contentDelivery',
            handler,
            validate: {
                query: {
                    content_token: Joi.string().required()

                }
            },
            description: 'Gets all documents',
            notes: '....',
            tags: ['api', 'document']
        }
    };
};
