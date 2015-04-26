var fs = require('fs');
var path = require('path');
var wiredep = require('wiredep');
var BUILD_CONFIG = require('./build.config.js');

var files = [];

var bowerComponents = wiredep({
    devDependencies: true
});

if (bowerComponents) {
    files = files.concat(bowerComponents.js);
}
files = files.concat(BUILD_CONFIG.karma.files);
console.log("files:", files);
module.exports = function(config) {
    'use strict';

    config.set({
        autoWatch: true,
        basePath: './',
        frameworks: [
            'mocha',
            'chai',
            'sinon'
        ],
        files: files,
        client: {
            mocha: {
                ui: 'bdd'
            }
        },
        exclude: [],
        port: 8180,
        browsers: ['PhantomJS'],
        singleRun: true,
        colors: true,
        logLevel: config.LOG_INFO,
        reporters: ['progress', 'coverage'],
        junitReporter: {
            outputFile: 'build/reports/karma-report.xml'
        },
        plugins: [
            'karma-chai',
            'karma-mocha',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-junit-reporter',
            'karma-sinon',
            'karma-coverage',
            'karma-ng-html2js-preprocessor'
        ],
        preprocessors: {
            'src/**/*.html': 'ng-html2js',
            'src/!(coverage)/**/!(*.spec).js': ['coverage']
        },
        // configure the reporter
        coverageReporter: {
            dir: 'coverage',
            reporters: [
                {type: 'html', subdir: 'html'},
                {type: 'text', subdir: '.'},
                {type: 'lcovonly', subdir: '.'},
                {type: 'json', subdir: '.'},
                {type: 'cobertura', subdir: '.'}
            ]
        },

        ngHtml2JsPreprocessor: {
            moduleName: BUILD_CONFIG.client.moduleName,
            stripPrefix: BUILD_CONFIG.client.baseDirectory
        }
    });
};
