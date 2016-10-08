'use strict';
const Boom = require('boom');
const internals = {};

internals.implementation = (server, options) => {

    return {
        authenticate: (request, reply) => {

            const token = request.query[options.tokenName || 'token'];

            if (!token) {
                return reply(Boom.badRequest('Bad Boom Request'));
            }

            request.auth.token = token;

            options.validateFunc(token, request, (err, user) => {

                if (err) {
                    return reply(Boom.badRequest('Unknown Token'));
                }
                else if (!user) {
                    return reply(Boom.unauthorized('Unauthorized'));
                }
                return reply.continue({ credentials: user._id || token, artifacts: token });
            });
        },
        response: (request, reply) => {

            if (options.responseFunc && typeof options.responseFunc === 'function') {
                options.responseFunc(request, reply, (err) => {

                    if (err) {
                        return reply(Boom.badRequest());
                    }
                    reply.continue();
                });
            }
            else {
                reply.continue();
            }
        }
    };
};

exports.register = (server, options, next) => {

    server.auth.scheme('contentDelivery', internals.implementation);
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
