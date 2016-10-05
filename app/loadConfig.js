'use strict';
exports.loadConfig = function(environment) {
    if (!environment) {
        return new Error('Cannot load config file.');
    } else {
        var config;
        if(environment === 'production') {
            config = require('./../config/config.production.json');
        } else {
            config = require('./../config/config.dev.json');
        }
        return config;
    }
};