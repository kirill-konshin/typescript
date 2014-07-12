require.config({
    baseUrl: '.'
});

define(['../build/amd/index', '../build/standalone/rc-sdk', '../build/standalone/rc-sdk.min'], function(amd, standalone, minified) {

    console.log('RequireJS Loaded');

    if ('RCSDK' in window) {
        console.warn('Global RCSDK is defined');
    } else {
        console.info('Global RCSDK is NOT defined (correct behavior)');
    }

    // Expose for debug
    window.RCSDK = {
        amd: amd,
        standalone: standalone,
        minified: minified
    };

    console.log(RCSDK);

    //amd.modelInstance.foo();

});
