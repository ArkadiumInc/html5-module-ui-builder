/**
 * Created by popelnitskiyd on 5/19/2016.
 */

var gulp = require('gulp');
var rimraf = require('gulp-rimraf');
var util = require('gulp-util');
var connect = require('gulp-connect');
var processhtml = require('gulp-processhtml');
var queue = require('run-sequence');
var browserfy = require('gulp-browserify');
var bower = require('gulp-bower');

var paths = {
    all: ['src/*.*', 'src/**/*.*'],
    src: 'src/',
    libs: 'libs/',
    phaser: './bower_components/phaser/build/phaser.min.js',
    js: 'js/main.js',
    html: '*.html',
    dist: './dist/'
};

gulp.task('bower:install', function() {
    return bower();
});

gulp.task('clean', function() {
    return gulp.src([paths.dist], {read: false})
        .pipe(rimraf({forse: false}))
        .on('error', util.log);
});

gulp.task('copy:libs', function() {
    return gulp.src(paths.phaser)
        .pipe(gulp.dest(paths.dist + paths.libs))
        .on('error', util.log);
});

gulp.task('js:compile', function() {
    return gulp.src(paths.src + paths.js, {read: false})
        .pipe(browserfy({debug: true}))
        .pipe(gulp.dest(paths.dist))
        .on('error', util.log);
});

gulp.task('html:compile', function() {
    return gulp.src(paths.src + paths.html)
        .pipe(processhtml())
        .pipe(gulp.dest(paths.dist))
        .on('error', util.log);
});

gulp.task('connect', function() {
    connect.server({root: [paths.dist], port: 9000, livereload: false});
});

gulp.task('reconnect', function() {
    gulp.src(paths.dist).pipe(connect.reload()).on('error', util.log);
});

gulp.task('watch', function() {
    return gulp.watch(paths.all, ['recompile']);
});

gulp.task('compile', function() {
    queue('bower:install', 'clean', 'copy:libs', 'js:compile', 'html:compile', 'watch');
});

gulp.task('recompile', function() {
    queue('js:compile', 'html:compile', 'reconnect');
});

gulp.task('default', function() {
    queue('compile', 'connect');
});