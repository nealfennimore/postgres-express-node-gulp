'use strict';

var gulp = require('gulp'),
    supervisor = require('gulp-supervisor'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    livereload = require('gulp-livereload'),
    tinylr,
    path = require('path');

// ================ Config for ruby-sass not supporting globs
var src = {
    sass: 'client/styles/',
    scss: 'client/styles/*.scss',
}

function handleError() {
  return { errorHandler: notify.onError({
          title: 'Error!',
          message: '<%= error.message %>',
          appIcon: __dirname + '/error.png'
        })};
}

function handleSuccess(message) {
  return {
          title: 'Success!',
          message: message || 'You handle success very well',
          appIcon: __dirname + '/success.png',
          sound: true
        };
}

// ================ Livereload
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(35729);
});

function notifyLiveReload(event) {
  var fileName = path.relative(__dirname, event.path);
  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

// ================ Start Server
gulp.task('server', function() {
  supervisor( './server/app', {
        args: [],
        watch: [ 'server' ],
        ignore: [ 'client' ],
        pollInterval: 500,
        extensions: [ 'js' ],
        exec: 'node',
        debug: true,
        debugBrk: false,
        harmony: true,
        noRestartOn: false,
        forceWatch: true,
        quiet: false
  });
});

// ================ Styles
gulp.task('styles', function() {
  return notify('Starting styles')
    .pipe(plumber(handleError()))
    .pipe(sass(src.sass, { style: 'expanded' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest('client/dist'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('client/dist'))
    .pipe(notify(handleSuccess('All the styles.')));
});

// ================ Watch
gulp.task('watch', function() {
  gulp.watch(src.scss, ['styles']);
  gulp.watch('client/*.html', notifyLiveReload);
  gulp.watch('client/**/*.hbs', notifyLiveReload);
  gulp.watch('client/dist/*.css', notifyLiveReload);
});

gulp.task('default', ['server', 'livereload', 'watch'], function() {

});