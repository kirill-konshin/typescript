///<reference path='../../definitions/lib/node.d.ts' />

import http = require('http');
import observable = require('../core/observable');

export class NodeTransport extends observable.Observable {

    req:http.ClientRequest;

    constructor() {
        super();
        var req = http.request({}, function (res) {
        });
    }

}