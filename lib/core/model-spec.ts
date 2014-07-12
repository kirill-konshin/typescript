///<reference path='../../definitions/test.d.ts' />

declare var require;
var expect: typeof chai.expect = require('chai').expect;
import model = require('./model');

describe('Model', function () {

    it('throws an error when calling foo() or bar() method', function () {

        var m = new model.Model();

        expect(function () {
            m.foo();
        }).throws(Error);

        expect(function () {
            m.bar();
        }).throws(Error);

    });

});