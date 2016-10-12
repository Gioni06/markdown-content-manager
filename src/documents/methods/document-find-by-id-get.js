'use strict';

const DocumentModel = require('./../../models/DocumentsModel/documentModel');
const Boom = require('boom');
const _ = require('lodash');

module.exports = (request, reply) => {

    const Marked = require('marked');

    const format = request.query.format;
    const id = request.params.id;
    const include_fm = request.query.front_matter;
    const owner = request.auth.credentials || request.query.apiKey;
    const query = { _id: id, owner };

    DocumentModel.findDocumentById(query, (err, document) => {

        if (err || !document) {
            return reply(Boom.notFound('Document not found'));
        }

        if (include_fm === true) {
            if (document.attributes.length > 0) {
                let front = '---\n';

                _.forEach(document.attributes, (attr) => {

                    front += `${attr.tag} : ${attr.value}    \n`;
                });

                front += '---\n';

                document.body = front + document.body;
            }
        }

        if (format === 'html') {
            const response = reply(Marked(document.body));
            response.type('text/html');
            response.header('X-Content-Type', 'markdown');
            return response;
        }

        if (format === 'markdown') {
            const response = reply(document.body);
            response.type('text/markdown');
            response.header('X-Content-Type', 'markdown');
            return response;
        }

        return reply({ message: 'Document found', data: document }).code(200);
    });
};
