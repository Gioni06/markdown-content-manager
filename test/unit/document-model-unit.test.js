'use strict';

const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const DocumentModel = require('./../../src/models/DocumentsModel/documentModel');

const Sinon = require('sinon');

lab.experiment('DocumentModel', () => {

    lab.it('should save a document', (done) => {

        const document = {
            body: '## This is a test'
        };

        const Document = new DocumentModel(document);

        expect(Document.body).to.equal('## This is a test');
        done();
    });


    lab.it('should get a document by id', (done) => {

        const document = {
            body: '## This is a test',
            owner: '1234'
        };

        const Document = new DocumentModel(document);

        Document.validate();

        const findOneStub = Sinon.stub(DocumentModel, 'findOne').yields(null, Document);

        DocumentModel.findDocumentById({ id: '123', owner: '1234' }, (err, res) => {

            expect(err).to.equal(null);
            expect(res.body).to.equal('## This is a test');
            findOneStub.restore();
            done();
        });
    });

    lab.it('should return an error when no document with id exists', (done) => {

        const findOneStub = Sinon.stub(DocumentModel, 'findOne').yields(new Error('Document not found'), null);

        DocumentModel.findDocumentById({ id: '123' }, (err, res) => {

            expect(err.message).to.equal('Document not found');
            expect(res).to.equal(null);
            findOneStub.restore();
            done();
        });
    });
});
