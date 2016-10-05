'use strict';

const server = require('./src/server');

server.start(function () {
    server.log('info', 'Server running at: ' + server.info.uri);
});