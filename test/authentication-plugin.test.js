'use strict';

const Code = require('code');
const Lab = require('lab');
const Hapi = require('hapi');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const sinon = require('sinon');
var UserModel = require('./../src/models/UserModel/userModel');

lab.experiment('Authentication Plugin', function() {

    lab.it('should create a new user', function(done) {
        var expectedUser = {
            _id: '132',
            email: 'test@test.de',
            password: '123'
        };

        // Create a new user instance from mocked mongoose model
        var UserMock = sinon.mock(new UserModel(expectedUser));

        // Stub the save function on the instance prototype
        var User = sinon.stub(UserModel.prototype,'save').yields(null, expectedUser);


        var registerHandler = require('./../src/authentication/methods/register-method');
        var registerRoute = require('./../src/authentication/routes/register-post');
        var server = new Hapi.Server();
        server.connection();
        server.route(registerRoute(registerHandler().handler));
        var request = {
            method : 'POST',
            url: '/register',
            payload: {
                email: 'test@test.de',
                password: '123'
            }
        };

        server.inject(request, function(response) {
            expect(response.statusCode).to.equal(201);
            UserMock.restore();
            User.restore();
            server.stop(done);
        });
    });

    lab.it('should fail when user creation fails', function(done) {

        var expectedUser = {
            _id: '132',
            email: 'test@test.de',
            password: '123'
        };

        // Create a new user instance from mocked mongoose model
        var UserMock = sinon.mock(new UserModel(expectedUser));

        // Stub the save function on the instance prototype
        var User = sinon.stub(UserModel.prototype,'save').yields(new Error('Save error'));

        var registerHandler = require('./../src/authentication/methods/register-method');
        var registerRoute = require('./../src/authentication/routes/register-post');
        var server = new Hapi.Server();
        server.connection({});
        server.route(registerRoute(registerHandler().handler));
        var request = {
            method : 'POST',
            url: '/register',
            payload: {
                email: 'test@test.de',
                password: '123'
            }
        };
        server.inject(request, function(response) {
            expect(response.statusCode).to.equal(400);
            expect(response.result.message).to.equal('Cannot create user');
            server.stop(done);
        });
    });


});