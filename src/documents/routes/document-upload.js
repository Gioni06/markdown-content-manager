'use strict';

const Joi = require('joi');


module.exports = (handler) => {

    return {
        method: 'POST',
        path: '/upload-document',
        config: {
            auth: 'jwt',
            handler,
            payload: {
                maxBytes: 209715200,
                output: 'stream',
                parse: false
            },
            description: 'Upload Content from a markdown file and create a new document',
            notes: '....',
            tags: ['api', 'document']
        }
    };
};
