'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Bcrypt = require('bcrypt');

const PreSaveFunction = require('./preSaveFn');
const AddApiKeyFunction = require('./addApiKeysFn');

const UserSchema = Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    apiKeyProduction: {
        type: String
    },
    apiKeyPreview: {
        type: String
    }
});


UserSchema.pre('save', PreSaveFunction);
UserSchema.pre('save', AddApiKeyFunction);

UserSchema.methods.comparePassword = function (candidatePassword, cb) {

    Bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {

        /* $lab:coverage:off$ */
        if (err) {
            throw new Error('no match');
        }
        /* $lab:coverage:on$ */

        if (isMatch === false) {
            cb(false,true);
        }

        if (isMatch === true) {
            cb(true,false);
        }
    });
};

UserSchema.methods.saveUser = function (cb) {

    this.model('User').findOne({ email: this.email }, (err, user) => {

        if (err) {
            return cb(err,null);
        }

        if (user) {
            if (user.email) {
                return cb(new Error('User already exists'),null);
            }
        }
        this.save((err, savedUser) => {

            if (err) {
                return cb(err,null);
            }
            return cb(null, savedUser);
        });
    });
};


module.exports = Mongoose.model('User', UserSchema);
