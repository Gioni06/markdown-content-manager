'use strict';
const Pack = require('./../package.json');


const hapiOptions = {
    info: {
        'title': 'Markdown Content Server Documentation',
        'version': Pack.version,
        contact: {
            'name': 'Jonas Duri',
            'email': 'jonas.duri@gmail.com'
        }
    },
    securityDefinitions: {
        'jwt': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header',
            'placeholder': 'API Key'
        }
    },
    tags: [
        {
            name: 'Welcome',
            description: 'Basic welcome message'
        },
        {
            name : 'User',
            description: 'A more personal welcome message'
        }
    ],
    schemes: ['http'],
    host: 'localhost:8080',
    jsonEditor: true,
    sortTags: 'name',
    sortEndpoints: 'path'
};

module.exports = hapiOptions;
