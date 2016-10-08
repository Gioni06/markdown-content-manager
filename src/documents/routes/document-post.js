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
                    body: Joi.string().required().example('# Markdown Content'),
                    attributes: Joi.array().items(Joi.object({
                        tag: Joi.string().example('Title'),
                        value: Joi.string().example('My Title')
                    }))
                }
            },
            description: 'Creates a new document',
            notes: '....',
            tags: ['api', 'document']
        }
    };
};
