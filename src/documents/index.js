'use strict';

const PostDocumentHandler = require('./methods/document-post-method');
const PostDocument = require('./routes/document-post');

exports.register = function (Server, options, next) {

    Server.dependency('hapi-auth-jwt2', (server,done) => {

        server.route(PostDocument(PostDocumentHandler));
        done();
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
