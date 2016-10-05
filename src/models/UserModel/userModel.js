'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Bcrypt = require('bcrypt');
const PreSaveFunction = require('./preSaveFn');

const UserSchema = Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', PreSaveFunction);

UserSchema.methods.comparePassword = function (candidatePassword, cb) {

    Bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {

        /* $lab:coverage:off$ */
        if (err) {
            throw new Error(err);
        }
        /* $lab:coverage:on$ */

        if (isMatch === false) {
            cb(true,false);
        }

        if (isMatch === true) {
            cb(false,true);
        }
    });
};

module.exports = Mongoose.model('User', UserSchema);
