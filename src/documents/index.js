'use strict';

const PostDocumentHandler = require('./methods/document-post-method');
const PostDocument = require('./routes/document-post');

const UploadDocumentHandler = require('./methods/document-upload-method');
const UploadDocument = require('./routes/document-upload');

const GetDocumentHandler = require('./methods/document-find-by-id-get');
const GetDocument = require('./routes/document-get');

const GetDocumentsHandler = require('./methods/documents-get');
const GetDocuments = require('./routes/documents.get');

exports.register = function (Server, options, next) {

    Server.dependency('hapi-auth-jwt2', (server,done) => {

        server.route(PostDocument(PostDocumentHandler));
        server.route(GetDocument(GetDocumentHandler));
        server.route(GetDocuments(GetDocumentsHandler));
        server.route(UploadDocument(UploadDocumentHandler));
        done();
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
