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

UserSchema.statics.saveUser = function (candidate, cb) {

    this.findOne({ email: candidate.email }, (err, user) => {

        if (err) {
            return cb(err,null);
        }

        if (user) {
            if (user.email) {
                return cb(new Error('User already exists'),null);
            }
        }
        candidate.save((err, savedUser) => {

            if (err) {
                return cb(err,null);
            }
            return cb(null, savedUser);
        });
    });
};


module.exports = Mongoose.model('User', UserSchema);
