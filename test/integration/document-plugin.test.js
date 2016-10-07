'use strict';

const Code = require('code');
const Lab = require('lab');
const Hapi = require('hapi');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const Sinon = require('sinon');
const DocumentModel = require('./../../src/models/DocumentsModel/documentModel');
const HapiAuthJWT = require('hapi-auth-jwt2');
const Jwt = require('jsonwebtoken');

lab.experiment('Document Plugin', () => {

    lab.it('should create a new document', (done) => {

        const document = {
            body: '## This is a test'
        };

        // Stub the save function on the instance prototype
        const SaveMock = Sinon.stub(DocumentModel.prototype,'save').yields(null, document);


        const RegisterHandler = require('./../../src/documents/methods/document-post-method');
        const RegisterRoute =  require('./../../src/documents/routes/document-post');

        const session = {
            valid: true,
            id: 'test',
            exp: new Date().getTime() + 30 * 60 * 1000 // expires in 30 minutes time
        };
        const JWT_SECRET = 'secret';

        const request = {
            method : 'POST',
            url: '/document',
            payload: {
                body: '## This is a test'
            },
            headers: {
                Authorization: Jwt.sign(session, JWT_SECRET)
            }
        };

        const Server = new Hapi.Server();
        Server.connection();
        Server.register([HapiAuthJWT], (err) => {

            if (err) {
                throw new Error(err);
            }

            Server.auth.strategy('jwt', 'jwt',
                {
                    key: JWT_SECRET,
                    validateFunc: (decoded, req, callback) => {

                        callback(null, true);
                    }
                });

            Server.route(RegisterRoute(RegisterHandler));

            Server.inject(request, (response) => {

                expect(response.statusCode).to.equal(201);
                SaveMock.restore();
                Server.stop(done);
            });
        });

    });

    lab.it('should respond with an error when document creation fails', (done) => {

        // Stub the save function on the instance prototype
        const SaveMock = Sinon.stub(DocumentModel.prototype,'save').yields(new Error('Error'), null);


        const RegisterHandler = require('./../../src/documents/methods/document-post-method');
        const RegisterRoute =  require('./../../src/documents/routes/document-post');

        const session = {
            valid: true,
            id: 'test',
            exp: new Date().getTime() + 30 * 60 * 1000 // expires in 30 minutes time
        };
        const JWT_SECRET = 'secret';

        const request = {
            method : 'POST',
            url: '/document',
            payload: {
                body: '## This is a test'
            },
            headers: {
                Authorization: Jwt.sign(session, JWT_SECRET)
            }
        };

        const Server = new Hapi.Server({
            debug: {
                log: ['error']
            }
        });
        Server.connection();
        Server.register([HapiAuthJWT], (err) => {

            if (err) {
                throw new Error(err);
            }

            Server.auth.strategy('jwt', 'jwt',
                {
                    key: JWT_SECRET,
                    validateFunc: (decoded, req, callback) => {

                        callback(null, true);
                    }
                });

            Server.route(RegisterRoute(RegisterHandler));

            Server.inject(request, (response) => {

                expect(response.statusCode).to.equal(400);
                SaveMock.restore();
                Server.stop(done);
            });
        });

    });
});
