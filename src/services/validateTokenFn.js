'use strict';
const RedisService = require('./../services/RedisService');

const validate = (decoded, request, callback, credentials) => {

    RedisService.get(decoded.id, (error, response) => {

        if (error) {
            server.log(error);
        }

        let session;

        if (response) {
            session = JSON.parse(response);

            if (session.valid !== true) {
                return callback(error, false);
            }

            if (new Date().getTime() > session.exp) {
                const newSession = Object.assign({}, session);
                newSession.valid = false;
                RedisService.set(session.id, JSON.stringify(newSession));
                return callback(new Error('Session expired'), false);
            }

            return callback(null, true);

        }
        return callback(error, false);


    });
};

module.exports = validate;
