///<reference path='../definitions/lib/node.d.ts' />
///<reference path='../definitions/lib/pubnub.d.ts' />
///<reference path='../definitions/lib/cryptojs.d.ts' />

// NodeJS version

export var Pubnub: typeof PUBNUB = require('pubnub');
export var CryptoJS: typeof CryptoJS = require('cryptojs');
export import model = require('./core/model');