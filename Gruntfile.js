'use strict';

var gruntBuild = function(grunt)
{
    var BUILD_CONFIG = require('./build.config.js');

    require('load-grunt-tasks')(grunt);

    // Un-comment to display the elapsed execution time of grunt tasks
    // require('time-grunt')(grunt);
    // 
    var bowerClasses = [];
    bowerClasses = require('wiredep')().js;

    var bowerCss = [];
    bowerCss = require('wiredep')().css;

    var tasks = {

        // Checks your JavaScript doesn't have common errors defined by the rules in .jshintrc
        jshint: {
            options: {
                force: true,
                jshintrc: '.jshintrc'
            },

            src: BUILD_CONFIG.client.sourceFiles
        },

        // Checks your JavaScript code style matches the rules in .jscsrc
        jscs: {
            options: {
                force: true,
                config: '.jscsrc'
            },
            src: BUILD_CONFIG.client.sourceFiles
        },

        // // Cyclomatic complexity checks for JavaScript files
        complexity: {
            all: {
                src: BUILD_CONFIG.client.sourceFiles,
                options: {
                    breakOnErrors: true,
                    errorsOnly: false,               // show only maintainability errors
                    cyclomatic: [3, 7, 12],          // or optionally a single value, like 3
                    halstead: [8, 13, 20],           // or optionally a single value, like 8
                    maintainability: 100,
                    hideComplexFunctions: false,     // only display maintainability
                    broadcast: false                 // broadcast data over event-bus
                }
            }
        },

        // Unit test code coverage for mocha server tests
        // [jwarden 4.20.2015] NOTE: 80% coverage is difucult to get, ecspecially
        // on branches. Consider lowering these numbers signicantly to 10% in the beginning
        // of a large refactoring effort and slowly ratchet up. Branches are ecspecially hard
        // if you're dealign with an older code base wasn't written to be testable.
        coverage: {
            server: {
                options: {
                    dir: 'coverage',
                    coverageThresholds: {
                     'statements': 80,
                     'branches':   80,
                     'lines':      80,
                     'functions':  80
                    }
                }
            }
        },

        // Runs unit tests
        karma: {
            test: {
                configFile: BUILD_CONFIG.karma.configFile,
                singleRun: true
            }
        },

        // // Cleans up the build folders to have a nice, fresh, new build
        // clean: {
        //     dev: {
        //         src: ['build', 'coverage']
        //     },

        //     devCSS: {
        //         src: ['build/**/*.css']
        //     },

        //     prod: {
        //         src: ['build', 'coverage']
        //     },

        //     prodTmp: {
        //         src: '.tmp'
        //     },

        //     prodCSS: {
        //         src: ['build/**/*.css']
        //     }
        // },

        // // Copies files from development to the build directory
        // copy: {
        //     devJS: {
        //         expand: true,
        //         cwd: 'src/client',
        //         src: ['*.js','**/*.js', '!**/*spec*.js', '!test/**'],
        //         dest: 'build'
        //     },

        //     devAssets: {
        //         expand: true,
        //         cwd: 'src/client/<%= APP_NAME %>/layout/assets',
        //         src: ['**/*.{jpg,png,svg,gif,ico}'],
        //         dest: 'build'
        //     },

        //     devTemplates: {
        //         expand: true,
        //         cwd: 'src/client',
        //         src: ['**/*.html'],
        //         dest: 'build'
        //     },

        //     prodHTML: {
        //         files: [
        //             {
        //                 expand: false,
        //                 cwd: '.',
        //                 src: 'src/client/index.html',
        //                 dest: 'build/index.html'
        //             },
        //             {
        //                 expand: true,
        //                 cwd: '.',
        //                 flatten: true,
        //                 src: 'bower_components/bootstrap/fonts/*',
        //                 dest: 'build/fonts'
        //         }]
        //     }
        // },

        // // Compiles LESS files to CSS
        // less: {
        //     dev: {
        //         files: {
        //           '<%= COMPILED_LESS_FILE %>': '<%= MAIN_LESS_FILE %>'
        //         }
        //     },

        //     prod: {
        //         options: {
        //             compress: true,
        //             cleancss: true
        //         },
        //         files: {
        //             '<%= COMPILED_LESS_FILE %>': MAIN_LESS_FILE
        //         }
        //     }
        // },

        // // Parses CSS and adds vendor-prefixed CSS properties
        // autoprefixer: {
        //     options: {
        //         map: false
        //     },
        //     prod: {
        //         files: [
        //             {
        //                 expand: true,
        //                 cwd: '.tmp',
        //                 src: '{,*/}*.css',
        //                 dest: '.tmp'
        //             }
        //         ]
        //     }
        // },

        // // Adds, removes and rebuilds AngularJS dependency injection annotations.
        // // Important especially after uglification.
        // ngAnnotate: {
        //     prod: {
        //         options: {
        //             and: true,
        //             singleQuotes: true
        //         },
        //         files: [{
        //             expand: true,
        //             cwd: 'src/client/',
        //             src: [
        //                 '*.js',
        //                 '**/**.js',
        //                 '!test/**.js',
        //                 '!**/**.spec.js'
        //             ],
        //             dest: '.tmp/scripts'
        //         }]
        //     }
        // },

        // // Concatenates JavaScript files to reduce HTTP requests
        // concat: {
        //     prod: {
        //         cwd: '.',
        //         expand: true,
        //         files: {
        //             '<%= JS_CONCATENATED_PATH %>': [
        //                 '.tmp/scripts/*.js',
        //                 '.tmp/scripts/**/*.module.js',
        //                 '.tmp/scripts/**/*.js'],
        //             '<%= JS_BOWER_CONCATENATED_PATH %>': bowerClasses,
        //             '<%= CSS_BOWER_CONCATENATED_PATH %>': bowerCss
        //         }

        //     }
        // },

        // // Minifies your JavaScript files to save on file size
        // uglify: {
        //     prod: {
        //         files: {
        //             '<%= JS_CONCATENATED_PATH %>': JS_CONCATENATED_PATH
        //         }
        //     }
        // },

        // // Concatenates & pre-loads your AngularJS templates
        // ngtemplates: {
        //     prod: {
        //         options: {
        //             module: APP_MODULE,
        //             standalone: false,
        //             append: true,
        //             htmlmin: {
        //                 collapseWhitespace: true,
        //                 conservativeCollapse: true,
        //                 collapseBooleanAttributes: true,
        //                 removeCommentsFromCDATA: true,
        //                 removeOptionalTags: true
        //             }
        //         },
        //         cwd: 'src/client',
        //         src: ['**/*.html', '!index.html'],
        //         dest: JS_CONCATENATED_PATH
        //     }
        // },

        // // Static asset revisioning through file content hash (cache busting)
        // filerev: {
        //     prod: {
        //         src: [
        //             'build/**/*',
        //             '!build/**/*.{ico,html,xml}'
        //         ],
        //         filter: 'isFile'
        //     }
        // },

        // // Injects Bower packages into your index.html
        // wiredep: {
        //     client: {
        //         src: 'src/client/index.html',
        //         ignorePath: /\.\./
        //     },
        //     build: {
        //         src: 'build/index.html',
        //         ignorePath: /\.\./
        //     }
        // },

        // // Replaces references to non-optimized scripts or stylesheets into a set of HTML files (or any templates/views)
        // usemin: {
        //     'optimize-html': {
        //         options: {
        //             type: 'html'
        //         },
        //         files: [{
        //             src: ['build/index.html']
        //         }]
        //     },
        //     'optimize-css': {
        //         options: {
        //             type: 'css',
        //             assetsDirs: ['build/images']
        //         },
        //         files: [{
        //             src: ['build/**/*.css']
        //         }]
        //     }
        // },

        // // Injects references to files (scripts, stylesheets) into other files (index.html)
        // injector: {
        //     options: {
        //         template: 'build/index.html',
        //         addRootSlash: false,
        //         ignorePath: 'build/'
        //     },
        //     prod: {
        //         dest: 'build/index.html',
        //         src: [
        //             'build/*.css',
        //             'build/*.js'
        //      //       'build/<%= APP_NAME %>.bowerDependencies.js',
        //        //     'build/<%= APP_NAME %>.js',

        //         ]
        //     },
        //     dev: {
        //         files: {
        //             'build/index.html': [
        //                 'build/*.js',
        //                 'build/**/*.module.js',
        //                 'build/**/*.js',
        //                 'build/**/*.css',
        //                 'build/*.css'
        //             ]
        //         }
        //     }
        // },

        // nodemon: {
        //     serverStatic: {
        //         script: './src/static/app.js',
        //         options: {
        //             watch: ['src/api/**/*.js', 'src/static/**/*.js'],
        //             delay: 1000,
        //             nodeArgs: ['--debug'],
        //             env: {
        //                 PORT: staticServerConfig.port
        //             }
        //         },
        //         callback: function (nodemon) {
        //             nodemon.on('log', function (event) {
        //               console.log(event.colour);
        //             });

        //             // opens browser on initial server start
        //             nodemon.on('config:update', function () {
        //               // Delay before server listens on port
        //               setTimeout(function() {
        //                 require('open')('http://localhost:' + staticServerConfig.port);
        //               }, 1000);
        //             });

        //             // refreshes browser when server reboots
        //             nodemon.on('restart', function () {
        //               // Delay before server listens on port
        //               setTimeout(function() {
        //                 require('fs').writeFileSync('.rebooted', 'rebooted');
        //               }, 1000);
        //             });
        //           }
        //     }
        // },

        // concurrent: {
        //     serverApp: {
        //         tasks: [
        //             'nodemon:serverStatic',
        //             'watchServerAndClient',
        //             'open'
        //         ],
        //         options: {
        //             logConcurrentOutput: true
        //         }
        //     }
        // },

        // // Runs predefined tasks whenever watched file patterns are added, changed or deleted.
        // watch: {
        //     serverStatic: {
        //         files: ['.rebooted']
        //     },

        //     dev: {
        //         files: 'src/client/**/*',
        //         tasks: ['build_dev'],
        //         options: {
        //             livereload: true
        //         }
        //     },

        //     prod: {
        //         files: 'src/client/**/*',
        //         tasks: 'build_prod'
        //     }
        // }

        // browserSync: {
        //     dev: {
        //         bsFiles: {
        //             src : [
        //                 'src/client/**/*',
        //                 'src/client/index.html'
        //             ]
        //         },
        //         options: {
        //             watchTask: true
        //         }
        //     }
        // }


    };

    grunt.initConfig(tasks);

    // ************************************************************
    // ** development tasks **/
    grunt.registerTask('analyze',
        'Validates your code and ensures it follows consistent styling.', [
            'jshint',
            'jscs',
            'complexity'
    ]);
    grunt.registerTask('test',
        'Runs all unit tests based on the karm.conf.js configurations.', [
            'karma',
            'coverage'
    ]);

    grunt.registerTask('test2',
        'test, no coverage', [
        'karma']);

    grunt.registerTask('default', ['build_dev', 'open', 'watch:dev']);


    grunt.registerTask('open', function()
    {
        require('open')('http://localhost:' + staticServerConfig.port);
    });


    // -- helper tasks --/
    // css
    grunt.registerTask('css_dev', [
        'clean:devCSS',
        'less:dev'
    ]);

    // html
    grunt.registerTask('html_prod', [
        'clean:prod',
        'copy:prodHTML',
        'wiredep:build'
    ]);

    // build
    grunt.registerTask('build_dev', [
        'clean:dev',
        'css_dev',
        'copy:devJS',
        'copy:devAssets',
        'copy:devTemplates',
        'copy:prodHTML',
        'wiredep:build',
        'injector:dev'
    ]);

    grunt.registerTask('buildDev', function()
    {
        browserSync.notify("Recompiling dev...");
        grunt.task.run('build_dev');
    });

    grunt.registerTask('build_prod', [
        'clean:prod',
        'clean:prodCSS',
        'analyze',
        'test',
        'copy:devAssets',
        'less:prod',
        'autoprefixer:prod',
        'ngAnnotate:prod',

        'concat:prod',

        'ngtemplates:prod',
        'copy:prodHTML',
        'injector:prod',
    //   'wiredep:build',
        'uglify',
        'usemin:optimize-html',
        'usemin:optimize-css',
        'clean:prodTmp'


    ]);

    if (process.env.NODE_ENV === 'dev') {
        grunt.registerTask('build', ['build_dev']);
        grunt.registerTask('serve',
            'Validates your code, ensures styling is consistent, and then runs a local node server to test your application. It will then watch your local files. If they change, it will automatically reload.', [
            'build_dev',
            'concurrent'
        ]);
    }
    else {
        grunt.registerTask('build', ['build_prod']);
        grunt.registerTask('serve',
            'Validates your code, ensures styling is consistent, runs all of your unit tests, and concatenates and uglifies your CSS, HTML, and JavaScript together for production deployment. It then runs a local node server to test your application, and will then watch your local files. If they change, it will automatically reload.', [
                'build_prod',
                'concurrent'
        ]);
    }
};

module.exports = gruntBuild;
