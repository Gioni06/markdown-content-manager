'use strict';

const DocumentModel = require('./../../models/DocumentsModel/documentModel');
const Boom = require('boom');

module.exports = (request, reply) => {

    const userId = request.auth.credentials.id;
    const body = request.payload.body;
    const attributes = request.payload.attributes;

    const Document = new DocumentModel({
        attributes,
        body,
        owner: userId
    });

    Document.save((err, document) => {

        if (err) {
            return reply(Boom.badRequest('Cannot create document'));
        }
        return reply({ message: 'Document saved successfully', data: document }).code(201);
    });
};
