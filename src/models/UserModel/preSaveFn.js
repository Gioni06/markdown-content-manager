'use strict';
const SALT_WORK_FACTOR = 10;
const Bcrypt = require('bcrypt');

module.exports = function (next) {

    // only hash the password if it has been modified (or is new)
    /* $lab:coverage:off$ */
    if (!this.isModified('password')) {
        return next();
    }
    /* $lab:coverage:on$ */

    // generate a salt
    Bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        /* $lab:coverage:off$ */
        if (err) {
            return next(err);
        }
        /* $lab:coverage:on$ */

        // hash the password using our new salt

        Bcrypt.hash(this.password, salt, (err, hash) => {
            /* $lab:coverage:off$ */
            if (err) {
                return next(err);
            }
            /* $lab:coverage:on$ */

            // override the cleartext password with the hashed one
            this.password = hash;
            next();
        });
    });
};
