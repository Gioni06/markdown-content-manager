'use strict';
const JWT = require('jsonwebtoken');
const Boom = require('boom');
const RedisService = require('../../services/RedisService');
const UserModel = require('./../../models/UserModel/userModel');
const JWT_SECRET = process.env.JWT_SECRET;

/**
 *
 * @param request
 * @param reply
 */
module.exports = function (request, reply) {

    const query = { email: request.payload.email };

    UserModel.findOne(query, (err, user) => {

        if (err || !user) {
            reply(Boom.notFound(`Cannot find user with email ${request.payload.email}`));
            return;
        }
        user.comparePassword(request.payload.password, (match) => {

            if (match === false) {
                reply(Boom.unauthorized('Email or password is wrong'));
            }
            if (match === true) {

                const session = {
                    valid: true,
                    id: user._id,
                    exp: new Date().getTime() + 1 * 60 * 1000 // expires in 30 minutes time
                };

                RedisService.set(session.id, JSON.stringify(session));

                const token = JWT.sign(session, JWT_SECRET);
                reply({ token, user }).header('Authorization', token).code(200);
            }
        });
    });
};
