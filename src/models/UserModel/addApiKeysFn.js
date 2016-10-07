'use strict';

/* $lab:coverage:off$ */
const UUID = require('node-uuid');
module.exports = function (next) {

    if (!this.apiKeyProduction) {
        this.apiKeyProduction = UUID.v4().split('-').join('');
    }

    if (!this.apiKeyPreview) {
        this.apiKeyPreview = UUID.v4().split('-').join('');
    }
    next();
};
/* $lab:coverage:on$ */
