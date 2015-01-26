var gulp = require('gulp'),
		less = require('gulp-less'),
		usemin = require('gulp-usemin'),
		wrap = require('gulp-wrap'),
		connect = require('gulp-connect'),
		watch = require('gulp-watch'),
		templateCache = require('gulp-angular-templatecache'),
		minifyCss = require('gulp-minify-css'),
		minifyJs = require('gulp-uglify'),
		concat = require('gulp-concat'),
		rename = require('gulp-rename'),
		minifyHTML = require('gulp-minify-html');
// var es = require('event-stream');
var gutil = require('gulp-util');
// var uglify = require('gulp-uglify');
// var minifyHtml = require('gulp-minify-html');
// var minifyCss = require('gulp-minify-css');
// var rev = require('gulp-rev');
// require('events').EventEmitter.prototype._maxListeners = 100;



var paths = {
	js: 'src/js/**/*.*',
	data: 'src/data/**/*.*',
	fonts: 'src/fonts/**.*',
	images: 'src/img/**/*.*',
	templates: 'src/js/**/*.html',
	styles: 'src/less/**/*.less',
	index: 'src/index.html',
	// index: 'src/*.html',
	bower_fonts: 'src/bower_components/**/*.{ttf,woff,eof,svg}',
	bower_components: 'src/bower_components/**/*.*',
};


gulp.task('usemin', function() {
	return gulp.src(paths.index)
			.pipe(usemin({
				less: ['concat', less()],
				js: [minifyJs(), 'concat'],
				css: [minifyCss({keepSpecialComments: 0}), 'concat'],
			}))
			.pipe(gulp.dest('dist/'));
});

/**
 * Copy assets
 */
gulp.task('copy-assets', ['copy-images', 'copy-templates', 'concatenate-templates', 'copy-fonts', 'copy-data', 'copy-bower_fonts']);

gulp.task('copy-images', function() {
	return gulp.src(paths.images)
			.pipe(gulp.dest('dist/img'));
});

gulp.task('copy-templates', function() {
	return gulp.src(paths.templates)
			.pipe(gulp.dest('dist/js/'));
	;
});

gulp.task('concatenate-templates', function() {
	return gulp.src(paths.templates)
			.pipe(templateCache('mrt-tpl.js', {module: 'MRT'}))
			.pipe(gulp.dest('dist/tpls'));
	;
});

gulp.task('copy-fonts', function() {
	return gulp.src(paths.fonts)
			.pipe(gulp.dest('dist/fonts'));
});

gulp.task('copy-bower_fonts', function() {
	return gulp.src(paths.bower_fonts)
			.pipe(gulp.dest('dist/lib'));
});

gulp.task('copy-data', function() {
	return gulp.src(paths.data)
			.pipe(gulp.dest('dist/data'));
});




/**
 * Watch src
 */
gulp.task('watch', function() {
	gulp.watch([paths.styles, paths.index, paths.js], ['usemin']);
	gulp.watch([paths.images], ['copy-images']);
	gulp.watch([paths.templates], ['copy-templates', 'concatenate-templates']);
	// gulp.watch([paths.templates], []);
	gulp.watch([paths.fonts], ['copy-fonts']);
	gulp.watch([paths.bower_fonts], ['copy-bower_fonts']);
	gulp.watch([paths.data], ['copy-data']);

});



gulp.task('webserver', function() {
	connect.server({
		root: 'dist',
		port: 8086,
		livereload: true
	});
});

gulp.task('livereload', function() {
	gulp.src(['dist/**/*.*'])
			.pipe(watch())
			.pipe(connect.reload());
});

/**
 * Compile less
 */
gulp.task('compile-less', function() {
	return gulp.src(paths.styles)
			.pipe(less())
			.pipe(gulp.dest('dist/css'));
});

// gulp.task('build-compile', ['compile-less']);

gulp.task('build', ['usemin', 'copy-assets']);
gulp.task('default', ['build', 'webserver', 'livereload', 'watch']);
