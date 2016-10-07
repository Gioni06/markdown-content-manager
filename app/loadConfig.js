'use strict';

exports.loadConfig = function (environment) {

    let config;
    if (!environment) {
        return new Error('Cannot load config file.');
    }
    if (environment === 'production') {
        config = require('./../config/config.production.json');
    }
    else {
        config = require('./../config/config.dev.json');
    }
    return config;
};
