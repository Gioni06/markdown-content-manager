'use strict';
const UserModel = require('./../models/UserModel/userModel');

module.exports = (token, request, callback, credentials) => {

    UserModel.findOne({ apiKeyProduction: token }, (err, user) => {

        if (err) {
            return reply('error').code(403);
        }

        if (user) {
            request.auth.credentials = user._id;
            callback(null, user);
            return;
        }

        callback(new Error('Unknown token'), null);
    });
};
