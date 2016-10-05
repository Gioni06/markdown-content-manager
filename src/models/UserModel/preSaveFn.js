'use strict';
const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcrypt');

module.exports = function(next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    /* $lab:coverage:off$ */
    if (!user.isModified('password')) return next();
    /* $lab:coverage:on$ */

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        /* $lab:coverage:off$ */
        if (err) return next(err);
        /* $lab:coverage:on$ */

        // hash the password using our new salt

        bcrypt.hash(user.password, salt, function(err, hash) {
            /* $lab:coverage:off$ */
            if (err) return next(err);
            /* $lab:coverage:on$ */

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
};