'use strict';

var _ = require('lodash');
var Redis = require('redis');
var Config = require('./../../app/loadConfig');
var config = Config.loadConfig('development');

/**
 * Init Service
 * @type {{}}
 */


var service = {};

/**
 * Creates a redis client
 */
service.createClient = function() {
    return Redis.createClient(config.database.redis.port, config.database.redis.path, {detect_buffers: true});
};

/**
 * Sets a value in Redis store
 * @param key
 * @param val
 * @returns {*}
 */
service.set = function (key, val) {
    var redisClient = service.createClient();
    redisClient.set(key, val);
    redisClient.quit();
};

/**
 * Gets a value from Redis store
 * @param key
 * @param callback
 */
service.get = function (key, callback) {
    var redisClient = service.createClient();
    redisClient.get(key, function (err, reply) {
        callback(err, reply);
    });
    redisClient.quit();
};

module.exports  = service;