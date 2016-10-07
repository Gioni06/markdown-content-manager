'use strict';

const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const DocumentModel = require('./../../src/models/DocumentsModel/documentModel');

lab.experiment('DocumentModel', () => {

    lab.it('should save a document', (done) => {

        const document = {
            body: '## This is a test'
        };

        const Document = new DocumentModel(document);

        expect(Document.body).to.equal('## This is a test');
        done();
    });

});
