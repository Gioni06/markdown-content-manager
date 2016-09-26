'use strict';
const Pack = require('./package.json');
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Joi = require('joi');
const HapiSwagger = require('hapi-swagger');
const RESPONSE_TYPES = require('./const/response-types');
const hapiAuthJWT = require('hapi-auth-jwt2'); // http://git.io/vT5dZ
const JWT         = require('jsonwebtoken');   // used to sign our content
const port        = process.env.PORT;  // allow port to be set
const Redis = require('redis');

var redisClient = Redis.createClient('6379', 'redis', {detect_buffers: true});

redisClient.set("redis-health-check", "Status: Ok");

redisClient.get("redis-health-check", function (err, reply) {
    if(err) {
        console.log(err.toString())
    } else {
        console.log(reply.toString());
    }
});

var validate = function (decoded, request, callback) {
    console.log(" - - - - - - - DECODED token:");
    console.log(decoded);
    // do your checks to see if the session is valid
    redisClient.get(decoded.id, function (rediserror, reply) {
        /* istanbul ignore if */
        if(rediserror) {
            console.log(rediserror);
        }
        console.log(' - - - - - - - REDIS reply - - - - - - - ', reply);
        var session;
        if(reply) {
            session = JSON.parse(reply);
        }
        else { // unable to find session in redis ... reply is null
            return callback(rediserror, false);
        }

        if (session.valid === true) {
            return callback(rediserror, true);
        }
        else {
            return callback(rediserror, false);
        }
    });
};

// Create a server with a host and port
const server = new Hapi.Server();

server.connection({
    host: '0.0.0.0',
    port: 9000
});

const options = {
    info: {
        'title': 'Markdown Content Server Documentation',
        'version': Pack.version,
        contact: {
            'name': 'Jonas Duri',
            'email': 'jonas.duri@gmail.com'
        }
    },
    securityDefinitions: {
        'jwt': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header',
            'placeholder': 'API Key'
        }
    },
    tags: [
        {
            name: 'Welcome',
            description: 'Basic welcome message'
        },
        {
            name : 'User',
            description: 'A more personal welcome message'
        }
    ],
    schemes: ['http'],
    host: 'localhost:8080',
    jsonEditor: true,
    sortTags: 'name',
    sortEndpoints: 'path'
};

const hapiPlugins = [
    hapiAuthJWT,
    Inert,
    Vision,
    {
        register: HapiSwagger,
        options: options
    }
];

const jsonResponseSchema = Joi.object({
    status: Joi.number().required(),
    message: Joi.string().required(),
    data: Joi.object({data: Joi.string()})
});


server.register(hapiPlugins, function (err) {
    if(err) {
        throw err;
    }

    server.auth.strategy('jwt', 'jwt',
        { key: process.env.JWT_SECRET,
            validateFunc: validate,
            verifyOptions: { algorithms: [ 'HS256' ], ignoreExpiration: true }
        });
    server.auth.default('jwt');

    server.route({
        method: 'GET',
        path: "/auth",
        config: {
            auth: false,
            handler: function(request, reply) {
                var session = {
                    valid: true, // this will be set to false when the person logs out
                    id: 123123, // a random session id
                    exp: new Date().getTime() + 30 * 60 * 1000 // expires in 30 minutes time
                };
                // create the session in Redis
                redisClient.set(session.id, JSON.stringify(session));
                // sign the session as a JWT
                var token = JWT.sign(session, process.env.JWT_SECRET); // synchronous
                console.log(token);

                reply({text: 'Check Auth Header for your Token ' + token})
                    .header("Authorization", token);
            },
            description: 'Login and get authorization token',
            notes: '....',
            tags: ['api','User'],
        }
    });

    server.route({
        method: 'GET',
        path:'/welcome',
        config: {
            handler: function (request, reply) {
                const welcomeMessage = {
                    status: 200,
                    message: 'Ok',
                    data: {
                        data: `Welcome anonymous`
                    }
                };

                return reply(welcomeMessage)
                    .type(RESPONSE_TYPES.JSON)
                    .header('X-Author', 'Jonas Duri');
            },
            response: {
                schema: jsonResponseSchema
            },
            description: 'Get a friendly welcome message',
            notes: 'You can pass your name as a parameter',
            tags: ['api','Welcome'],
        }
    });

    server.route({
        method: 'GET',
        path:'/user/welcome/{name}',
        config: {
            auth: 'jwt',
            handler: function (request, reply) {
                const welcomeMessage = {
                    status: 200,
                    message: 'Ok',
                    data: {
                        data: `Welcome ${request.params.name}`
                    }
                };

                return reply(welcomeMessage)
                    .type(RESPONSE_TYPES.JSON)
                    .header('X-Author', 'Jonas Duri');
            },
            response: {
                schema: jsonResponseSchema
            },
            description: 'Get a friendly welcome message',
            notes: 'See the welcome message',
            tags: ['api','User'],
            validate: {
                params: {
                    name: Joi.string().required()
                }
            }
        }
    });

    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
