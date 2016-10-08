'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const DocumentSchema = Schema({
    attributes: [{
        tag: String,
        value: Schema.Types.Mixed
    }],
    body: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        ref: 'User',
        required: true
    }
});

DocumentSchema.statics.findDocumentById = function (query, callback) {

    this.model('Document').findOne(query, (err, document) => {

        if (err) {
            return callback(err, null);
        }
        callback(null, document);
    });
};

module.exports = Mongoose.model('Document', DocumentSchema);
