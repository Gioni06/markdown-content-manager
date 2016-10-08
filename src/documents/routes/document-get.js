'use strict';

const Joi = require('joi');

module.exports = (handler) => {

    return {
        method: 'GET',
        path: '/document/{id}',
        config: {
            auth: 'contentDelivery',
            handler,
            validate: {
                params: {
                    id: Joi.string().required()
                },
                query: {
                    format: Joi.string(),
                    content_token: Joi.string().required()

                }
            },
            description: 'Finds a document by id',
            notes: '....',
            tags: ['api', 'document']
        }
    };
};
