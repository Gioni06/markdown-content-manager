'use strict';

const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const Sinon = require('sinon');
const Rewire = require('rewire');
const RedisService = Rewire('./../../src/services/RedisService');

lab.experiment('Redis service unit test', () => {

    lab.it('should create a Redis client', (done) => {

        const RedisMock = {
            createClient: (port, host) => {

                return {
                    get: Sinon.spy((key, cb) => {

                        cb('test val');
                    }),

                    set: Sinon.spy((key, val) => {

                    }),

                    quit: Sinon.spy(() => {

                        return true;
                    })
                };
            }
        };

        RedisService.__set__('Redis', RedisMock);

        const client = RedisService.createClient('host', '123');
        expect(client.get).to.be.a.function();
        done();
    });

    lab.it('should set a value', (done) => {

        const redisMock = {
            get: Sinon.spy((key) => {

                return 'test val';
            }),
            set: Sinon.spy((key, val) => {

            }),
            quit: Sinon.spy(() => {

                return true;
            })
        };

        const createClient = Sinon.stub(RedisService, 'createClient', () => {

            return redisMock;
        });

        RedisService.set('test', 'test val');
        Sinon.assert.calledWith(redisMock.set, 'test', 'test val');
        Sinon.assert.callCount(redisMock.set, 1);
        createClient.restore();
        done();
    });

    lab.it('should get a value', (done) => {

        const redisMock = {
            get: Sinon.spy((key, cb) => {

                cb('test val');
            }),

            set: Sinon.spy((key, val) => {

            }),

            quit: Sinon.spy(() => {

                return true;
            })
        };

        const createClient = Sinon.stub(RedisService, 'createClient', () => {

            return redisMock;
        });

        RedisService.get('test', () => {

        });
        Sinon.assert.calledWith(redisMock.get, 'test');
        createClient.restore();
        done();
    });
});
