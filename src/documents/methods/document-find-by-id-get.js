'use strict';

const DocumentModel = require('./../../models/DocumentsModel/documentModel');
const Boom = require('boom');

module.exports = (request, reply) => {

    const Marked = require('marked');

    const format = request.query.format;
    const id = request.params.id;
    const owner = request.auth.credentials || request.query.apiKey;
    const query = { _id: id, owner };

    DocumentModel.findDocumentById(query, (err, document) => {

        if (err || !document) {
            return reply(Boom.notFound('Document not found'));
        }

        switch (format) {
            case 'html':
                const response = reply(Marked(document.body));
                response.type('text/html');
                response.header('X-Content-Type', 'markdown');
                return response;
            default:
                return reply({ message: 'Document found', data: document }).code(200);
        }
    });
};
