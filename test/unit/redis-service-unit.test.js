'use strict';

const Code = require('code');
const Lab = require('lab');
const Hapi = require('hapi');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const sinon = require('sinon');
var rewire = require('rewire');
var RedisService = rewire('./../../src/services/RedisService');

lab.experiment('Redis service unit test', function() {

    lab.it('should create a Redis client', (done) => {
        var RedisMock = {
          createClient : function(port, host) {
              return {
                  get: sinon.spy(function(key, cb){
                      cb('test val')
                  }),

                  set: sinon.spy(function(key, val){

                  }),

                  quit: sinon.spy(function(){
                      return true;
                  })
              };
          }
        };

        RedisService.__set__('Redis', RedisMock);

        var client = RedisService.createClient('host', '123');
        expect(client.get).to.be.a.function();
        done();
    });

    lab.it('should set a value', (done) => {

        var redisMock = {
            get: sinon.spy(function(key){
                return "test val";
            }),
            set: sinon.spy(function(key, val){

            }),
            quit: sinon.spy(function(){
                return true;
            })
        };

        var createClient = sinon.stub(RedisService,'createClient', function() {
            return redisMock;
        });

        RedisService.set('test', 'test val');
        sinon.assert.calledWith(redisMock.set, 'test', 'test val');
        sinon.assert.callCount(redisMock.set, 1);
        createClient.restore();
        done();
    });

    lab.it('should get a value', (done) => {

        var redisMock = {
            get: sinon.spy(function(key, cb){
                cb('test val')
            }),

            set: sinon.spy(function(key, val){

            }),

            quit: sinon.spy(function(){
                return true;
            })
        };

        var createClient = sinon.stub(RedisService,'createClient', function() {
            return redisMock;
        });

        RedisService.get('test', function() {

        });
        sinon.assert.calledWith(redisMock.get,'test');
        createClient.restore();
        done();
    });
});