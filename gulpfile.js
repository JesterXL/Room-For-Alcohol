var gulp 		= require('gulp');
var browserSync = require('browser-sync');
var del 		= require('del');
var vinylPaths  = require('vinyl-paths');
var typescript 	= require('gulp-typescript');
var concat 		= require('gulp-concat');
var tsify		= require('tsify');
var browserify	= require('browserify');
var source 		= require('vinyl-source-stream');
var buffer 		= require('vinyl-buffer');
var wiredep 	= require('wiredep').stream;
var inject 		= require('gulp-inject');
var nodemon 	= require('gulp-nodemon');
var jshint 		= require('gulp-jshint');
var jscs 		= require('gulp-jscs');
var complexity 	= require('gulp-complexity');
var karma 		= require('karma').server;
var stylish 	= require('jshint-stylish');
var eslint 		= require('gulp-eslint');
var eslintPathFormatter = require('eslint-path-formatter');
var mocha 		= require('gulp-mocha');
var  mochaLcovReporter = require('mocha-lcov-reporter');
var coverage = require('gulp-coverage');
var open = require('gulp-open');
var istanbul = require('gulp-istanbul');
// var Promise = require('Bluebird');
var merge = require('gulp-merge');

var CONFIG 		= require('./build.config');

gulp.task('hello', function()
{
	console.log('Waaazzuuuuuppp');
});

// **********************************************************************
// **********************************************************************
// **********************************************************************

gulp.task('analyze', function() {
  return gulp.src(CONFIG.client.sourceFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .on('error', function(e)
    {
    	console.warn('jshint failed.');
    })
    .pipe(jscs())
    .on('error', function(e)
    {
    	console.warn('jscs failed');
    })
    .pipe(complexity({
        	cyclomatic: [3, 7, 12],
            halstead: [8, 13, 20],
            maintainability: 100
        })
    )
    .on('error', function(e)
    {
    	console.warn('complexity failed');
    });
});

gulp.task('test', function (done)
{
  karma.start({
	    configFile: __dirname + '/' + CONFIG.karma.configFile,
	    singleRun: true
	  }, function()
	  {
	  	done();
	  });
});

gulp.task('judge', function(done)
{
	gulp.src(CONFIG.client.sourceFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .on('error', function(e)
    {
    	this.emit('end');
    })
    .pipe(jscs())
    .on('error', function(e)
    {
    	this.emit('end');
    })
    .pipe(eslint())
    .pipe(eslint.format(eslintPathFormatter))
    .pipe(eslint.failOnError())
    .pipe(complexity({
        	cyclomatic: [3, 7, 12],
            halstead: [8, 13, 20],
            maintainability: 100
        })
    )
    .on('error', function(e)
    {
    	this.emit('end');
    })
    .on('finish', function()
    {
    	karma.start({
	    configFile: __dirname + '/' + CONFIG.karma.configFile,
	    singleRun: true
		  }, function()
		  {
		  	done();
		  })
    });
    
});

// **********************************************************************
// **********************************************************************
// **********************************************************************

gulp.task('clean', function(done)
{
    del(CONFIG.buildFilesAndDirectoriesToClean, function()
        {
            console.log("clean done");
            done();
        });
});

gulp.task('copyIndex', ['clean'], function()
{
	return gulp.src('src/client/index.html')
	.pipe(wiredep({ignorePath: "../../"}))
	.pipe(gulp.dest('./build'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('inject', ['copyIndex'], function()
{
	var sources = gulp.src(CONFIG.client.sourceFiles, {read: false});
	return gulp.src('./build/index.html')
	.pipe(inject(sources, {ignorePath: '/src/client/'}))
	.pipe(gulp.dest('./build'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('copyJS', ['clean'], function()
{
	return gulp.src(CONFIG.client.sourceFiles)
    .pipe(gulp.dest('./build'));
});

gulp.task('browserSync', function(done)
{
	browserSync({
		baseDir: 'build/index.html'
	});
	done();
});

gulp.task('watch', function()
{
	gulp.watch([
        'src/client/index.html', 
        'src/client/**/*.js'], 
        ['clean', 'copyJS', 'copyIndex', 'inject'])
    .on('change', function(sup)
    {
        browserSync.reload();
    });
});

gulp.task('start', function (done)
{
  nodemon({
	    script: 'src/static/app.js',
	    ext: 'js',
	  	env: { 'NODE_ENV': 'development' }
  	});
  done();
});

gulp.task('default', [
	'clean', 
	'copyJS', 
	'copyIndex', 
	'inject', 
	'browserSync', 
    'watch',
	'start'
]);
