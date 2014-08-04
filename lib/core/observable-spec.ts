///<reference path='../../definitions/test.d.ts' />

var expect: typeof chai.expect = require('chai').expect;
import observable = require('./observable');

describe('Observable', function () {

    it('has events array', function () {

        var o = new observable.Observable();

        expect(o.events).to.be.an('array');
        expect(o.events.length).to.equal(1);

    });

});