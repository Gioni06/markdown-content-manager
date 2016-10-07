'use strict';

const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const UserModel = require('./../../src/models/UserModel/userModel');
const Sinon = require('sinon');

lab.experiment('UserModel', () => {

    lab.it('should compare passwords', (done) => {

        const expectedUser = {
            _id: '132',
            email: 'test@test.de',
            password: '$2a$10$xoIFSmYy6GNLKxGEQbxKwusHsvOffzn3uaYJIpqJDTCxIA76MIesu'
        };

        // Create a new user instance from mocked Mongoose model
        const User = new UserModel(expectedUser);
        User.validate();
        // // Stub the save function on the instance prototype
        // var User = Sinon.stub(UserModel.prototype,'comparePassword').yields(null, true);
        User.comparePassword('test', (err, hash) => {

            expect(hash).to.equal(true);
            expect(err).to.equal(false);
            done();
        });
    });

    lab.it('should throw an error when password is invalid', (done) => {

        const expectedUser = {
            _id: '132',
            email: 'test@test.de',
            password: '$2a$10$xoIFSmYy6GNLKxGEQbxKwusHsvOffzn3uaYJIpqJDTCxIA76MIesu'
        };

        // Create a new user instance from mocked Mongoose model
        const User = new UserModel(expectedUser);
        User.validate();
        // // Stub the save function on the instance prototype
        // var User = Sinon.stub(UserModel.prototype,'comparePassword').yields(null, true);
        User.comparePassword('invalid', (err, hash) => {

            expect(hash).to.equal(false);
            expect(err).to.equal(true);
            done();
        });
    });

    lab.it('should not save a user which is already saved', (done) => {

        const expectedUser = {
            _id: '132',
            email: 'test@test.de',
            password: '$2a$10$xoIFSmYy6GNLKxGEQbxKwusHsvOffzn3uaYJIpqJDTCxIA76MIesu'
        };

        // Create a new user instance from mocked Mongoose model
        const User = new UserModel(expectedUser);
        const findOneStub = Sinon.stub(UserModel, 'findOne').yields(null, expectedUser);
        User.validate();
        // // Stub the save function on the instance prototype
        // var User = Sinon.stub(UserModel.prototype,'comparePassword').yields(null, true);
        User.saveUser((err, user) => {

            expect(err.message).to.equal('User already exists');
            findOneStub.restore();
            done();
        });
    });

    lab.it('should save a user which is not already saved', (done) => {

        const expectedUser = {
            _id: '132',
            email: 'test@test.de',
            password: '$2a$10$xoIFSmYy6GNLKxGEQbxKwusHsvOffzn3uaYJIpqJDTCxIA76MIesu'
        };

        const User = new UserModel(expectedUser);
        User.validate();

        User.save = (callback) => {

            callback(null, expectedUser);
        };

        const findOneStub = Sinon.stub(UserModel, 'findOne').yields(null, undefined);

        User.saveUser((err, user) => {

            expect(err).to.equal(null);
            expect(user.email).to.equal('test@test.de');
            findOneStub.restore();
            done();
        });
    });

    lab.it('should not save a user when findone returns an error', (done) => {

        const expectedUser = {
            _id: '132',
            email: 'test@test.de',
            password: '$2a$10$xoIFSmYy6GNLKxGEQbxKwusHsvOffzn3uaYJIpqJDTCxIA76MIesu'
        };

        // Create a new user instance from mocked Mongoose model
        const User = new UserModel(expectedUser);
        User.validate();

        User.save = (callback) => {

            callback(null, expectedUser);
        };

        const findOneStub = Sinon.stub(UserModel, 'findOne').yields(new Error('Error'), []);

        User.saveUser((err, user) => {

            expect(err.message).to.equal('Error');
            findOneStub.restore();
            done();
        });
    });

    lab.it('should not save a user when save returns an error', (done) => {

        const expectedUser = {
            _id: '132',
            email: 'test@test.de',
            password: '$2a$10$xoIFSmYy6GNLKxGEQbxKwusHsvOffzn3uaYJIpqJDTCxIA76MIesu'
        };
        // Create a new user instance from mocked Mongoose model
        const User = new UserModel(expectedUser);
        User.validate();

        User.save = (callback) => {

            callback(new Error('Error'), null);
        };

        const findOneStub = Sinon.stub(UserModel, 'findOne').yields(null, []);

        User.saveUser((err, user) => {

            expect(err.message).to.equal('Error');
            findOneStub.restore();
            done();
        });
    });
});
