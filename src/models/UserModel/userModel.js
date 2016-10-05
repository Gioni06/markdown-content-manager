'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const preSaveFunction = require('./preSaveFn');

var UserSchema = Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', preSaveFunction);


UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(isMatch === false) {
            cb(true, false)
        }
        if(isMatch === true) {
            cb(false, true)
        }
    });
};

module.exports = mongoose.model('User', UserSchema);