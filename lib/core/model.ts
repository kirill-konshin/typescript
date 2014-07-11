import observable = require('./observable');

export class Model extends observable.Observable {

    public constructor() {

        super();

    }

    foo(...args) {
        throw new Error(args[0]);
    }

    bar(...args) {
        throw new Error(args[0]);
    }

}