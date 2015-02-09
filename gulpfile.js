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
		minifyHtml = require('gulp-minify-html'),
		replace = require('gulp-replace-task'),
		argv = require('yargs').argv,
		fs = require('fs-utils'),
		gutil = require('gulp-util');
// var es = require('event-stream');

// var uglify = require('gulp-uglify');
// var minifyHtml = require('gulp-minify-html');
// var minifyCss = require('gulp-minify-css');
// var rev = require('gulp-rev');
// require('events').EventEmitter.prototype._maxListeners = 100;



var paths = {
	module: 'src/js/module/mrt/',
	js: 'src/js/module/**/*.js',
	data: 'src/data/**/*.*',
	fonts: 'src/fonts/**.*',
	images: 'src/img/**/*.*',
	templates: 'src/js/**/*.html',
	styles: 'src/less/**/*.less',
	index: 'src/index.html',
	config: 'src/js/config/',
	parameter: 'src/js/config/parameters.js',
	// index: 'src/*.html',
	bower_fonts: 'src/bower_components/**/*.{otf,ttf,woff,eof,svg,woff2}',
	bower_components: 'src/bower_components/**/*.*',
};

var outputDir = argv.env || 'dist';
paths.outputDir = outputDir + '/';

gulp.task('usemin', function() {
	return gulp.src(paths.index)
			.pipe(usemin({
				 less: ['concat', less()],
				 // js: [minifyJs(), 'concat'],
                                 js: [minifyJs()],
				 css: [minifyCss({keepSpecialComments: 0}), 'concat'],
				 html: [minifyHtml({empty: true})]
			}))
			.pipe(gulp.dest(paths.outputDir));
});

gulp.task('replace', function() {
	// Get the environment from the command line
	var env = argv.env || 'dev';

	// Read the settings from the right file
	var filename = env + '.json';
	var evn = JSON.parse(fs.readFileSync(paths.config + filename, 'utf8'));

// Replace each placeholder with the correct value for the variable.  
	gulp.src(paths.parameter)
			.pipe(replace({
				patterns: [
					{
						match: 'env',
						replacement: evn
					}
				]
			})).pipe(gulp.dest(paths.module));
});

/**
 * Copy assets
 */

gulp.task('bootstrap', ['replace']);
gulp.task('copy-assets', ['copy-images', 'copy-templates', 'concatenate-templates', 'copy-fonts', 'copy-data', 'copy-bower_fonts']);
gulp.task('build-custom', ['custom-js', 'custom-less', 'build-bootstrap-less']);

gulp.task('copy-images', function() {
	return gulp.src(paths.images)
			.pipe(gulp.dest(paths.outputDir + 'img'));
});

gulp.task('copy-templates', function() {
	return gulp.src(paths.templates)
			.pipe(gulp.dest(paths.outputDir + 'js/'));
	;
});

gulp.task('concatenate-templates', function() {
	return gulp.src(paths.templates)
			.pipe(templateCache('mrt-tpl.js', {module: 'MRT'}))
			.pipe(gulp.dest(paths.outputDir + 'tpls'));
	;
});

gulp.task('copy-fonts', function() {
	return gulp.src(paths.fonts)
			.pipe(gulp.dest(paths.outputDir + 'fonts'));
});

gulp.task('copy-bower_fonts', function() {
	return gulp.src(paths.bower_fonts)
			.pipe(rename({
				dirname: '/fonts'
			}))
			.pipe(gulp.dest(paths.outputDir + 'lib'));
});




gulp.task('custom-js', function() {
	return gulp.src(paths.js)
			// .pipe(minifyJs())
			.pipe(concat('mrt.min.js'))
			.pipe(gulp.dest(paths.outputDir + 'js'));
});


/**
 * Compile less
 */
gulp.task('custom-less', function() {
	gulp.src(paths.styles)
			.pipe(less())
			.pipe(concat('mrt.css'))
			.pipe(gulp.dest(paths.outputDir + 'css'));

	return gulp.src(paths.outputDir + 'css/mrt.css')
			.pipe(minifyCss())
			.pipe(rename('mrt.min.css'))
			.pipe(gulp.dest(paths.outputDir + 'css/'));
});

gulp.task('copy-data', function() {
	return gulp.src(paths.data)
			.pipe(gulp.dest(paths.outputDir + 'data'));
});

/**
 * Compile less
 */
gulp.task('compile-less', function() {
	return gulp.src(paths.styles)
			.pipe(less())
			.pipe(gulp.dest(paths.outputDir + 'css'));
});



/**
 * Watch src
 */
gulp.task('watch', function() {

	gulp.watch([paths.styles], ['custom-less']);
	gulp.watch([paths.styles], ['compile-less']);
	gulp.watch([paths.images], ['copy-images']);
	gulp.watch([paths.templates], ['copy-templates', 'concatenate-templates']);
	// gulp.watch([paths.templates], []);
	gulp.watch([paths.js], ['custom-js']);
	gulp.watch([paths.fonts], ['copy-fonts']);
	gulp.watch([paths.bower_fonts], ['copy-bower_fonts']);
	gulp.watch([paths.data], ['copy-data']);
	gulp.watch(['src/bootstrap-less/*.less'], ['build-bootstrap-less', 'usemin']);
	gulp.watch([paths.index], ['usemin']);

});



gulp.task('webserver', function() {
	connect.server({
		root: outputDir,
		port: 8086,
		livereload: true
	});
});

gulp.task('livereload', function() {
	gulp.src([paths.outputDir + '**/*.*'])
			.pipe(watch())
			.pipe(connect.reload());
});


gulp.task('build-bootstrap-less', function(){
    return gulp.src('src/bootstrap-less/theme.less')
        .pipe(less())
		.pipe(concat('bootstrap.css'))
        .pipe(gulp.dest('src/css'));
});
// gulp.task('build-compile', ['compile-less']);

gulp.task('build', ['bootstrap', 'copy-assets', 'build-custom', 'usemin']);
gulp.task('default', ['build', 'webserver', 'livereload', 'watch']);
