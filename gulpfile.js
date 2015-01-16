var gulp = require('gulp'),
        less = require('gulp-less'),
        usemin = require('gulp-usemin'),
        wrap = require('gulp-wrap'),
        connect = require('gulp-connect'),
        watch = require('gulp-watch'),
        templateCache = require('gulp-angular-templatecache');

var paths = {
    js: 'src/js/**/*.*',
    data: 'src/data/**/*.*',
    fonts: 'src/fonts/**.*',
    images: 'src/img/**/*.*',
    templates: 'src/js/**/*.html',
    styles: 'src/less/**/*.less',
    // index: 'src/index.html',
    index: 'src/**/*.html',
    bower_fonts: 'src/bower_components/**/*.{ttf,woff,eof,svg}',
    bower_components: 'src/bower_components/**/*.*',
};


gulp.task('usemin', function() {
    return gulp.src(paths.index)
            .pipe(usemin({
        less: ['concat', less()],
        js: ['concat', wrap('(function(){ \n<%= contents %>\n})();')],
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
            .pipe(gulp.dest('dist/tpls'));
    ;
});

gulp.task('concatenate-templates', function() {
    return gulp.src(paths.templates)
            .pipe(templateCache('pension-tpl.js', {module: 'Pension'}))
            .pipe(gulp.dest('dist/tpls'));
    ;
});

gulp.task('copy-fonts', function() {
    return gulp.src(paths.fonts)
            .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copy-data', function() {
    return gulp.src(paths.data)
            .pipe(gulp.dest('dist/data'));
});


gulp.task('copy-bower_fonts', function() {
    return gulp.src(paths.bower_fonts)
            .pipe(gulp.dest('dist/lib'));
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
    gulp.watch([paths.data], ['copy-data']);
    gulp.watch([paths.bower_fonts], ['copy-bower_fonts']);
});



gulp.task('webserver', function() {
    connect.server({
        root: 'dist',
        port: 8085,
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

gulp.task('build', ['usemin', 'copy-assets']);
gulp.task('default', ['build', 'webserver', 'livereload', 'watch']);
