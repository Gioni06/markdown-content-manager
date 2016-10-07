'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const DocumentSchema = Schema({
    body: {
        type: String,
        required: true
    }
});

module.exports = Mongoose.model('Document', DocumentSchema);
