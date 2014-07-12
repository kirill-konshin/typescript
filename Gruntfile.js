(function() {
    "use strict";

    /**
     * @param {IGrunt} grunt
     */
    module.exports = function(grunt) {

        require('time-grunt')(grunt);

        var path = require('path'),
            pkg = grunt.file.readJSON('package.json');

        //grunt.file.mkdir is capable of creating nested subdirs

        grunt.initConfig({
            pkg: pkg,
            clean: {
                node: {
                    src: ['<%= pkg.paths.node %>']
                },
                amd: {
                    src: ['<%= pkg.paths.amd %>']
                },
                standalone: {
                    src: ['<%= pkg.paths.standalone %>']
                }
            },
            typescript: {
                options: {
                    noLib: false,
                    target: 'ES5',
                    basePath: '<%= pkg.paths.lib %>',
                    sourceMap: true,
                    declaration: false,
                    comments: true
                },
                node: {
                    src: ['<%= pkg.paths.libTSMask %>'],
                    dest: '<%= pkg.paths.node %>',
                    options: {
                        module: 'commonjs'
                    }
                },
                amd: {
                    src: ['<%= pkg.paths.libTSMask %>'],
                    dest: '<%= pkg.paths.amd %>',
                    options: {
                        module: 'amd'
                    }
                }
            },
            browserify: {
                standalone: {
                    src: ['<%= pkg.paths.lib %>/index.ts'],
                    dest: '<%= pkg.paths.standaloneFile %>.js',
                    options: {
                        preBundleCB: function(bundle) {
                            bundle.plugin('tsify', {target: 'ES5', module: 'commonjs'});
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
                standalone: {
                    files: {
                        '<%= pkg.paths.standaloneFile %>.js.map': ['<%= pkg.paths.standaloneFile %>.js']
                    }
                }
            },
            uglify: {
                standalone: {
                    options: {
                        sourceMap: true,
                        sourceMapName: '<%= pkg.paths.standaloneFile %>.min.js.map',
                        sourceMapIn: '<%= pkg.paths.standaloneFile %>.js.map',
                        sourceMapIncludeSources: true,
                        wrap: true
                    },
                    files: {
                        '<%= pkg.paths.standaloneFile %>.min.js': ['<%= pkg.paths.standaloneFile %>.js']
                    }
                }
            },
            replace: {
                sourceMapSupport: {
                    src: ['<%= pkg.paths.node %>/**/*.js'],
                    overwrite: true,
                    replacements: [
                        {
                            from: /((?:.|\n)*)/i,
                            to: '$1require("source-map-support").install();'
                        }
                    ]
                },
                sourceMapPath: {
                    src: ['<%= pkg.paths.node %>/**/*.js.map', '<%= pkg.paths.amd %>/**/*.js.map'],
                    overwrite: true,
                    replacements: [
                        {
                            from: /"sources":\[".*?lib\//i,
                            to: '"sources":["./'
                        }
                    ]
                }
            },
            compress: {
                standalone: {
                    options: {
                        mode: 'gzip',
                        pretty: true,
                        level: 9
                    },
                    expand: true,
                    cwd: '<%= pkg.paths.standalone %>',
                    src: ['**/*.js'],
                    dest: '<%= pkg.paths.standalone %>'
                }
            },
            watch: {
                options: {
                    atBegin: true,
                    reload: true,
                    interrupt: false
                },
                all: {
                    files: ['<%= pkg.paths.libTSMask %>'],
                    tasks: ['concurrent:all']
                },
                node: {
                    files: ['<%= pkg.paths.libTSMask %>'],
                    tasks: ['node']
                },
                amd: {
                    files: ['<%= pkg.paths.libTSMask %>'],
                    tasks: ['amd']
                },
                standalone: {
                    files: ['<%= pkg.paths.libTSMask %>'],
                    tasks: ['standalone']
                }
            },
            concurrent: {
                all: {
                    tasks: ['amd', 'node', 'standalone'],
                    options: { //@see https://github.com/sindresorhus/grunt-concurrent#options
                        limit: 4
                    }
                }
            }
        });

        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-compress');
        grunt.loadNpmTasks('grunt-contrib-requirejs');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-typescript');
        grunt.loadNpmTasks('grunt-browserify');
        grunt.loadNpmTasks('grunt-exorcise');
        grunt.loadNpmTasks('grunt-text-replace');
        grunt.loadNpmTasks('grunt-concurrent');

        grunt.registerTask('processSourceMaps', 'Replace missing source map sources and make relative paths', function() {

            var sourcePath = path.join(__dirname, grunt.template.process('<%= pkg.paths.lib %>')),
                originalFile = grunt.template.process('<%= pkg.paths.standalone %>/<%= pkg.name %>.js.map'),
                minifiedFile = grunt.template.process('<%= pkg.paths.standalone %>/<%= pkg.name %>.min.js.map'),
                originalContent = grunt.file.readJSON(originalFile),
                minifiedContent = grunt.file.readJSON(minifiedFile);

            originalContent.sources = originalContent.sources.map(function(file) {

                file = file.replace(sourcePath, '.'); // remove path to project
                if (file.indexOf('_prelude.js') > -1) file = './require-stub.js'; // rename prelude.js created by TSify/Browserify

                return file;

            });

            minifiedContent.sourcesContent = originalContent.sourcesContent;
            minifiedContent.sources = originalContent.sources;

            grunt.file.write(originalFile, JSON.stringify(originalContent));
            grunt.file.write(minifiedFile, JSON.stringify(minifiedContent));

        });

        grunt.registerTask('amd', 'AMD/RequireJS build', [
            'clean:amd',
            'typescript:amd',
            'replace:sourceMapPath'
        ]);

        grunt.registerTask('node', 'CommonJS/NodeJS build', [
            'clean:node',
            'typescript:node',
            'replace:sourceMapSupport',
            'replace:sourceMapPath'
        ]);

        grunt.registerTask('standalone', 'Standalone build for browser', [
            'clean:standalone',
            'browserify:standalone', // compile TS and concatenate into one JS file
            'exorcise:standalone', // extract source maps to a separate file
            'uglify:standalone', // minify
            'processSourceMaps', // replace missing source map sources and make relative paths
            'compress:standalone' // gzip compression
        ]);

        grunt.registerTask('default', 'Build everything', [
            'concurrent:all'
        ]);

    };

})();