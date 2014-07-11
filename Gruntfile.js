(function() {
    "use strict";

    module.exports = function(grunt) {

        var path = require('path'),
            pkg = grunt.file.readJSON('package.json'),
            tmpPath = path.normalize(__dirname + '/' + pkg.buildDir + '/tmp');

        grunt.registerTask('parseSourceMaps', '', function() {

            var original = grunt.file.readJSON(pkg.buildDir + '/out-browserify.js.map'),
                minified = grunt.file.readJSON(pkg.buildDir + '/out-browserify.min.js.map');

            original.sources = original.sources.map(function(file){

                file = file.replace(tmpPath + '/', './');

                if (file.indexOf('_prelude.js') != -1) file = './require-stub.js';

                return file;

            });

            minified.sourcesContent = original.sourcesContent;
            minified.sources = original.sources;

            grunt.file.write(pkg.buildDir + '/out-browserify.js.map', JSON.stringify(original));
            grunt.file.write(pkg.buildDir + '/out-browserify.min.js.map', JSON.stringify(minified));

        });

        grunt.initConfig({
            pkg: pkg,
            clean: {
                build: {
                    src: [
                        '<%= pkg.buildDir %>/tmp/**/*'
                    ],
                    options: {
                        force: true
                    }
                }
            },
            copy: {
                build: {
                    files: [
                        {expand: true, cwd: './lib', src: ['./**/*.ts'], dest: '<%= pkg.buildDir %>/tmp', filter: 'isFile'},
                        {
                            expand: true,
                            cwd: path.dirname(path.relative(__dirname, require.resolve('almond'))),
                            src: ['almond.js'],
                            dest: '<%= pkg.buildDir %>/tmp',
                            filter: 'isFile'
                        }
                    ]
                },
                publish: {
                    files: [
                        {expand: true, cwd: '<%= pkg.buildDir %>/tmp', src: ['./out-*'], dest: '<%= pkg.buildDir %>', filter: 'isFile'}
                    ]

                }
            },
            ts: {
                // A specific target
                build: {
                    src: ["<%= pkg.buildDir %>/tmp/**/*.ts"],
                    //reference: "./build/tmp/reference.ts",
                    //out: './build/out.js',
                    outDir: '<%= pkg.buildDir %>/tmp',
                    //watch: 'lib',
                    options: {
                        target: 'es5',
                        module: 'amd',
                        sourceMap: true,
                        declaration: false,
                        removeComments: false
                    }
                }
            },
            requirejs: {
                build: {
                    options: {
                        baseUrl: '<%= pkg.buildDir %>/tmp',
                        name: 'almond',
                        generateSourceMaps: true,
                        preserveLicenseComments: true,
                        optimize: 'none',
                        out: '<%= pkg.buildDir %>/tmp/out-requirejs.js',
                        deps: ['index'],
                        insertRequire: ['index'],
                        wrap: true
                    }
                }
            },
            browserify: {
                build: {
                    src: [ './build/tmp/index.ts' ],
                    dest: '<%= pkg.buildDir %>/tmp/out-browserify.js',
                    options: {
                        preBundleCB: function(b) {
                            b.plugin('tsify', {target: 'ES5', module: 'commonjs'});
                        },
                        bundleOptions: {
                            debug: true,
                            standalone: 'RCSDK'
                        },
                        browserifyOptions: {
                        }
                    }
                }
            },
            exorcise: {
                build: {
                    files: {
                        '<%= pkg.buildDir %>/tmp/out-browserify.js.map': ['<%= pkg.buildDir %>/tmp/out-browserify.js']
                    }
                }
            },
            uglify: {
                build: {
                    options: {
                        sourceMap: true,
                        sourceMapName: '<%= pkg.buildDir %>/tmp/out-browserify.min.js.map',
                        sourceMapIn: '<%= pkg.buildDir %>/tmp/out-browserify.js.map',
                        sourceMapIncludeSources: true,
                        wrap: true
                    },
                    files: {
                        '<%= pkg.buildDir %>/tmp/out-browserify.min.js': ['<%= pkg.buildDir %>/tmp/out-browserify.js']
                    }
                }
            },
            watch: {
                scripts: {
                    files: ['./lib/**/*.ts'],
                    tasks: [
                        'rjs'
                    ],
                    options: {
                        atBegin: true,
                        reload: true,
                        interrupt: false
                    }
                }
            }
        });

        grunt.loadNpmTasks('grunt-ts');
        grunt.loadNpmTasks('grunt-browserify');
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-requirejs');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-browserify');
        grunt.loadNpmTasks('grunt-exorcise');
        grunt.loadNpmTasks('grunt-contrib-uglify');

        grunt.registerTask('rjs', 'Build using RJS', [
            'clean:build',
            'copy:build',
            'ts:build',
            'requirejs:build',
            'copy:publish'
        ]);

        grunt.registerTask('b', 'Build using Browserify', [
            'clean:build',
            'copy:build',
            'browserify:build', // compile TS and concatenate into one JS file
            'exorcise:build', // extract source maps in a separate file
            'uglify:build', // compress
            'copy:publish', // copy to build from temp
            'parseSourceMaps' // replace missing source map sources and create relative paths
        ]);

    };

})();