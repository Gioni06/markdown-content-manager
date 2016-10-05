'use strict';

const Server = require('./src/server');

Server.start(() => {

    Server.log('info', 'Server running at: ' + Server.info.uri);
});
