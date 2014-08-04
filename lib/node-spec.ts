///<reference path='../definitions/test.d.ts' />

var expect: typeof chai.expect = require('chai').expect;

import RCSDK = require('./node');

describe('Node version', function () {

    it('exports Pubnub', function () {

        expect(RCSDK.Pubnub).to.be.a('function');

    });

    it('exports CryptoJS', function () {

        expect(RCSDK.CryptoJS).to.be.an('object');

    });

});