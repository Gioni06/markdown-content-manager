'use strict';

// Ignore this eslint since module 'rewire' cannot work with const
/*eslint-disable */
let Redis = require('redis');
/*eslint-enable */
const Config = require('./../../app/loadConfig');
const config = Config.loadConfig('development');

/**
 * Init Service
 * @type {{}}
 */


const service = {};

/**
 * Creates a redis client
 */
service.createClient = () => {

    return Redis.createClient(config.database.redis.port, config.database.redis.path, { detect_buffers: true });
};

/**
 * Sets a value in Redis store
 * @param key
 * @param val
 * @returns {*}
 */
service.set = (key, val) => {

    const redisClient = service.createClient();
    redisClient.set(key, val);
    redisClient.quit();
};

/**
 * Gets a value from Redis store
 * @param key
 * @param callback
 */
service.get = (key, callback) => {

    const redisClient = service.createClient();
    redisClient.get(key, (err, reply) => {

        callback(err, reply);
    });
    redisClient.quit();
};

module.exports  = service;
