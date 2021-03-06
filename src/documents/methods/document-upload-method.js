'use strict';

const DocumentModel = require('./../../models/DocumentsModel/documentModel');
const Boom = require('boom');
const FrontMatterParser = require('front-matter');
const _ = require('lodash');
const Fs = require('fs');
const Multiparty = require('multiparty');

const upload = (files, reply, request) => {

    if (files.file[0].headers['content-type'] !== 'text/markdown') {
        return reply(Boom.notAcceptable('Only markdown files are supported for now'));
    }

    Fs.readFile(files.file[0].path,'utf8', (err, data) => {

        Fs.unlink(files.file[0].path);

        if (err) {
            return reply(Boom.internal('Read file error'));
        }
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

module.exports = (request, reply) => {

    const form = new Multiparty.Form();
    form.parse(request.payload, (err, fields, files) => {

        if (err) {
            reply(Boom.badData(err));
        }
        else {
            console.log(files)
            upload(files, reply, request);
        }
    });
};
