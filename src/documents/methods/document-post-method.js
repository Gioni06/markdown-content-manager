'use strict';

const DocumentModel = require('./../../models/DocumentsModel/documentModel');
const Boom = require('boom');

module.exports = (request, reply) => {

    const Document = new DocumentModel(request.payload);
    Document.save((err, document) => {

        if (err) {
            return reply(Boom.badRequest('Cannot create document'));
        }
        return reply({ message: 'Document saved successfully', data: document }).code(201);
    });
};
