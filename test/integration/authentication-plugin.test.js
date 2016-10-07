'use strict';

const Code = require('code');
const Lab = require('lab');
const Hapi = require('hapi');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const Sinon = require('sinon');
const UserModel = require('./../../src/models/UserModel/userModel');

lab.experiment('Authentication Plugin', () => {

    lab.it('should create a new user', (done) => {

        const expectedUser = {
            _id: '132',
            email: 'test@test.de',
            password: '123'
        };

        // Stub the save function on the instance prototype
        const SaveMock = Sinon.stub(UserModel.prototype,'saveUser').yields(null, expectedUser);


        const RegisterHandler = require('./../../src/authentication/methods/register-method');
        const RegisterRoute = require('./../../src/authentication/routes/register-post');
        const Server = new Hapi.Server();
        Server.connection();
        Server.route(RegisterRoute(RegisterHandler().handler));
        const request = {
            method : 'POST',
            url: '/register',
            payload: {
                email: 'test@test.de',
                password: '123'
            }
        };

        Server.inject(request, (response) => {

            expect(response.statusCode).to.equal(201);
            SaveMock.restore();
            Server.stop(done);
        });
    });

    lab.it('should fail when user already exists', (done) => {

        const SaveError = new Error('User already exists');


        const SaveUserMock = Sinon.stub(UserModel.prototype,'saveUser').yields(SaveError, null);

        const RegisterHandler = require('./../../src/authentication/methods/register-method');
        const RegisterRoute = require('./../../src/authentication/routes/register-post');

        const Server = new Hapi.Server();
        Server.connection({});
        Server.route(RegisterRoute(RegisterHandler().handler));

        const request = {
            method : 'POST',
            url: '/register',
            payload: {
                email: 'test@test.de',
                password: '123'
            }
        };

        Server.inject(request, (response) => {

            expect(response.statusCode).to.equal(406);
            SaveUserMock.restore();
            Server.stop(done);
        });
    });

    lab.it('should fail when user creation fails', (done) => {

        const SaveUserMock = Sinon.stub(UserModel.prototype,'saveUser').yields(new Error('Error'), null);

        const RegisterHandler = require('./../../src/authentication/methods/register-method');
        const RegisterRoute = require('./../../src/authentication/routes/register-post');
        const Server = new Hapi.Server();
        Server.connection({});
        Server.route(RegisterRoute(RegisterHandler().handler));
        const request = {
            method : 'POST',
            url: '/register',
            payload: {
                email: 'test_fail@test.de',
                password: '123'
            }
        };
        Server.inject(request, (response) => {

            expect(response.statusCode).to.equal(400);
            expect(response.result.message).to.equal('Cannot create user');
            SaveUserMock.restore();
            Server.stop(done);
        });
    });
});
