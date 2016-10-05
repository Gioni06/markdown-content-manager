'use strict';

const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const expect = Code.expect;

lab.experiment('Load Config', () => {

    lab.it('should load developement configuration', (done) => {

        const Config = require('./../../app/loadConfig');
        const config = Config.loadConfig('development');

        expect(config.environment).to.equal('development');
        done();
    });

    lab.it('should load production configuration', (done) => {

        const Config = require('./../../app/loadConfig');
        const config = Config.loadConfig('production');

        expect(config.environment).to.equal('production');
        done();
    });


    lab.it('should throw an error when no environment is specified', (done) => {

        const Config = require('./../../app/loadConfig');

        const Error = Config.loadConfig();

        expect(Error.message).to.equal('Cannot load config file.');
        done();
    });
});
