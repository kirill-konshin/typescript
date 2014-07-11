import observable = require('./observable');

export class Model extends observable.Observable {

    public constructor() {

        super();

    }

    foo() {
        throw new Error();
    }

}