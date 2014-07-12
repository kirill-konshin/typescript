export import model = require('./core/model');

export var modelInstance = new model.Model();

/*
(function (root, undefined?) {


    if (typeof exports !== 'undefined') {

        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = RCSDK;
        }

        exports.RCSDK = RCSDK;

    } else if (typeof window['define'] === 'function' && window['define'].amd) {

        window['define']([], function () {
            return RCSDK;
        });

    } else {

         RCSDK.noConflict = (function(original) {
         return function() {
         root.RCSDK = original;
         RCSDK.noConflict = undefined;
         return RCSDK;
         };
         })(root.RCSDK);

        root['RCSDK'] = RCSDK;

    }

})(this);
*/