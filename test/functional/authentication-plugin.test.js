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

        // Create a new user instance from mocked Mongoose model
        const UserMock = Sinon.mock(new UserModel(expectedUser));

        // Stub the save function on the instance prototype
        const User = Sinon.stub(UserModel.prototype,'save').yields(null, expectedUser);


        const RegisterHandler = require('./../../src/authentication/methods/register-method');
        const RegisterRoute = require('./../../src/authentication/routes/register-post');
        const Server = new Hapi.Server();
        Server.connection();
        Server.route(RegisterRoute(RegisterHandler().handler));
        const request = {
            method : 'POST',
            url: '/Register',
            payload: {
                email: 'test@test.de',
                password: '123'
            }
        };

        Server.inject(request, (response) => {

            expect(response.statusCode).to.equal(201);
            UserMock.restore();
            User.restore();
            Server.stop(done);
        });
    });

    lab.it('should fail when user creation fails', (done) => {

        const expectedUser = {
            _id: '132',
            email: 'test@test.de',
            password: '123'
        };

        // Create a new user instance from mocked Mongoose model
        Sinon.mock(new UserModel(expectedUser));

        // Stub the save function on the instance prototype
        Sinon.stub(UserModel.prototype,'save').yields(new Error('Save error'));

        const RegisterHandler = require('./../../src/authentication/methods/register-method');
        const RegisterRoute = require('./../../src/authentication/routes/register-post');
        const Server = new Hapi.Server();
        Server.connection({});
        Server.route(RegisterRoute(RegisterHandler().handler));
        const request = {
            method : 'POST',
            url: '/Register',
            payload: {
                email: 'test@test.de',
                password: '123'
            }
        };
        Server.inject(request, (response) => {

            expect(response.statusCode).to.equal(400);
            expect(response.result.message).to.equal('Cannot create user');
            Server.stop(done);
        });
    });
});
