'use strict';
/* $lab:coverage:off$ */
const SALT_WORK_FACTOR = 10;
const Bcrypt = require('bcrypt');

module.exports = function (next) {

    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }


    // generate a salt
    Bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {

        if (err) {
            return next(err);
        }


        // hash the password using our new salt

        Bcrypt.hash(this.password, salt, (err, hash) => {

            if (err) {
                return next(err);
            }

            // override the cleartext password with the hashed one
            this.password = hash;
            next();
        });
    });
};
/* $lab:coverage:on$ */
