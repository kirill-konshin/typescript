# TypeScript Playground

## Goals

* **(DONE)** Create a build system for TypeScript project, that successfully handles following tasks:
    * Supports different build types:
        * Pure AMD build for direct usage in RequireJS project (front-end dev mode)
        * Pure CommonJS build for NodeJS (with bundled source map support)
        * Standalone build for browser environment
            * Compiled as single-file
            * Compressed and/or minified
            * Should work without RequireJS, but should be still compatible with AMD/RequireJS environment
    * Compiles TypeScript preserving source map information for each original TS file no matter which buld type is used
    * Reduce TS compilator code duplication (like `...args` notation support or `extend` function, etc.)
* **(TBD)** Create test framework foundation
    * Mocha test framework (Chai assertion engine)
    * Karma and console test runners
    * Istanbul code coverage, which is obtained for original TS files (if possible)

## Installation

```
$ npm install
$ bower install
```

If you don't have Grunt or Bower do the following:
```
$ npm install -g bower grunt-cli
```

## Build types

Usage

```
$ grunt [type]
```

* ***empty type*** - concurrently build everything
* **amd** - Create AMD build for RequireJS
* **node** - Create CommonJS build for NodeJS
* **standalone** - Create standalone build for browser
* **watch[:type]** - watch, where type can be:
    * **all** - concurrently build everything
    * **amd|node|standalone** - separately build only specific type of build

## Testing

After build open `web/*.html` files in browser. Type `RCSDK.modelInstance.foo()` in standalone mode (files
`standalone[-min].html`) or `RCSDK.amd.modelInstance.foo()` in RequireJS mode (file `requirejs.html`) to get an error.

Also type `node node` in terminal. Script will immediately die with an error, take a close look on stack trace, it
should contain references to original TypeScript files.  

## Important notes

* All build paths are located in `package.json`
