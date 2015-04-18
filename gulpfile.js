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

gulp.task('hello', function()
{
	console.log('Waaazzuuuuuppp');
});

gulp.task('copyIndex', function()
{
	
	return gulp.src('src/client/index.html')
	.pipe(wiredep({ignorePath: "../.."}))
	.pipe(gulp.dest('./build'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('inject', function()
{
	var sources = gulp.src(['build/RoomForAlcohol.module.js'], {read: false});
	return gulp.src('./build/index.html')
	.pipe(inject(sources, {ignorePath: '/build/'}))
	.pipe(gulp.dest('./build'))
	.pipe(browserSync.reload({stream: true}));

	// var target = gulp.src('./src/index.html');
	// // It's not necessary to read the files (will speed up things), we're only after their paths: 
	// var sources = gulp.src(['./src/**/*.js', './src/**/*.css'], {read: false});

	// return target.pipe(inject(sources))
	// .pipe(gulp.dest('./src'));

});

gulp.task('browserSync', function()
{
	browserSync({
		startPath: 'index.html'
	});
});

gulp.task('watchFiles', function()
{
	gulp.watch('src/client/index.html', ['typescriptIt', 'copyIndex', 'inject']);
	gulp.watch('src/client/**/*.ts', ['typescriptIt', 'copyIndex', 'inject']);
});

gulp.task('typescriptIt', function()
{
	console.log("Running 'typescriptIt'...");
	browserify('./src/client/roomForAlcohol.module.ts')
	    .plugin(tsify)
	    .bundle()
	    .pipe(source('RoomForAlcohol.module.js'))
	    .pipe(buffer())
	    .pipe(gulp.dest('./build'));
});

gulp.task('clean', function()
{
	return gulp.src('./build', {read: false})
			.pipe(vinylPaths(del));
});

gulp.task('default', ['clean', 'typescriptIt', 'copyIndex', 'inject', 'browserSync', 'watchFiles']);