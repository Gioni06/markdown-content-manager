'use strict';

const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const sinon = require('sinon');
var UserModel = require('./../../src/models/UserModel/userModel');

lab.experiment('UserModel', function() {

    lab.it('should compare passwords', (done) => {
        var expectedUser = {
            _id: '132',
            email: 'test@test.de',
            password: '$2a$10$xoIFSmYy6GNLKxGEQbxKwusHsvOffzn3uaYJIpqJDTCxIA76MIesu'
        };

        // Create a new user instance from mocked mongoose model
        var User = new UserModel(expectedUser);
        User.validate();
        // // Stub the save function on the instance prototype
        // var User = sinon.stub(UserModel.prototype,'comparePassword').yields(null, true);
        User.comparePassword('test', function(err, hash) {
            expect(hash).to.equal(true);
            expect(err).to.equal(false);
            done();
        });
    });

    lab.it('should throw an error when password is invalid', (done) => {
        var expectedUser = {
            _id: '132',
            email: 'test@test.de',
            password: '$2a$10$xoIFSmYy6GNLKxGEQbxKwusHsvOffzn3uaYJIpqJDTCxIA76MIesu'
        };

        // Create a new user instance from mocked mongoose model
        var User = new UserModel(expectedUser);
        User.validate();
        // // Stub the save function on the instance prototype
        // var User = sinon.stub(UserModel.prototype,'comparePassword').yields(null, true);
        User.comparePassword('invalid', function(err, hash) {
            expect(hash).to.equal(false);
            expect(err).to.equal(true);
            done();
        });
    });

});