'use strict';

const DocumentModel = require('./../../models/DocumentsModel/documentModel');
const Boom = require('boom');
const FrontMatterParser = require('front-matter');
const _ = require('lodash');
const Fs = require('fs');
const multiparty = require('multiparty');
const UUID = require('node-uuid');

module.exports = (request, reply) => {

    var upload = function(files, reply) {

        if( files.file[0].headers['content-type'] !== 'text/markdown') {
            return reply(Boom.notAcceptable('Only markdown files are supported for now'))
        }

        Fs.readFile(files.file[0].path,'utf8', function(err, data) {
            const content = FrontMatterParser(data);

            const attributes = [];
            _.forEach(content.attributes, (val, key) => {

                attributes.push({ tag: key, value: val });
            });
            const Document = new DocumentModel({
                attributes,
                body: content.body,
                owner: request.auth.credentials.id
            });

            Document.save((err, document) => {
                if (err) {
                    return reply(Boom.badRequest('Cannot create document'));
                }
                return reply({ message: 'Document saved successfully', data: document }).code(201);
            });

        });
    };

    var form = new multiparty.Form();
    form.parse(request.payload, function(err, fields, files) {
        if (err) return reply(Boom.badData(err));
        else upload(files, reply);
    });

};
