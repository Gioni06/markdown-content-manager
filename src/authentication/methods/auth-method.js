'use strict';
const JWT = require('jsonwebtoken');
const Boom = require('boom');
const bcrypt = require('bcrypt');
const RedisService = require('../../services/RedisService');
const UserModel = require('./../../models/UserModel/userModel');

/**
 *
 * @param request
 * @param reply
 */
module.exports = function (request, reply) {
    var query = { email: request.payload.email };

    UserModel.findOne(query, (err, user) => {
        if (err) {
            reply(Boom.notFound(`Cannot find user with email ${request.payload.email}`));
        }
        user.comparePassword(request.payload.password, function (err, match) {
            if (err) {
                reply(Boom.unauthorized(`Email or password is wrong`));
            }
            if (match) {

                let session = {
                    valid: true,
                    id: user._id,
                    exp: new Date().getTime() + 1 * 60 * 1000 // expires in 30 minutes time
                };

                RedisService.set(session.id, JSON.stringify(session));

                let token = JWT.sign(session, process.env.JWT_SECRET);
                reply({token: token}).header("Authorization", token).code(200);
            }
        });
    });
};