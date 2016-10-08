'use strict';

const DocumentModel = require('./../../models/DocumentsModel/documentModel');
const Boom = require('boom');

module.exports = (request, reply) => {

    const owner = request.auth.credentials || request.query.apiKey;
    const query = { owner };

    DocumentModel.find(query, (err, documents) => {

        if (err || !documents) {
            return reply(Boom.notFound('Document not found'));
        }

        return reply({ message: 'Documents found', items: documents.length, data: { items: documents } }).code(200);
    });
};
