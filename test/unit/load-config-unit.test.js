'use strict';

const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const sinon = require('sinon');

lab.experiment('Load Config', function() {

    lab.it('should load developement configuration', (done) => {

        var Config = require('./../../app/loadConfig');
        var config = Config.loadConfig('development');

        expect(config.environment).to.equal('development');
        done();
    });

    lab.it('should load production configuration', (done) => {

        var Config = require('./../../app/loadConfig');
        var config = Config.loadConfig('production');

        expect(config.environment).to.equal('production');
        done();
    });


    lab.it('should throw an error when no environment is specified', (done) => {

        var Config = require('./../../app/loadConfig');

        var Error = Config.loadConfig();

        expect(Error.message).to.equal('Cannot load config file.');
        done();
    });
});