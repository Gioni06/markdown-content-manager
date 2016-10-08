/*
'use strict';

const DocumentModel = require('./../../models/DocumentsModel/documentModel');
const Boom = require('boom');
const FrontMatterParser = require('front-matter');

module.exports = (request, reply) => {
    const content = FrontMatterParser(markdown);

    const attributes = [];
    _.forEach(content.attributes, (val, key) => {

        attributes.push({ tag: key, value: val });
    });
    const Document = new DocumentModel({
        attributes,
        body: content.body,
        owner: userId
    });

    Document.save((err, document) => {

        if (err) {
            return reply(Boom.badRequest('Cannot create document'));
        }
        return reply({ message: 'Document saved successfully', data: document }).code(201);
    });
};
*/
