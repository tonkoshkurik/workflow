var gulp         = require('gulp');
var sass         = require('gulp-sass');
var browserSync  = require('browser-sync');
var cssnano      = require('gulp-cssnano');
var plumber      = require('gulp-plumber');
var uglify       = require('gulp-uglify');
var rename       = require("gulp-rename");
var imagemin     = require("gulp-imagemin");
var pngquant     = require('imagemin-pngquant');
var pug         = require('gulp-pug');
var concat       = require('gulp-concat');

//
// Compile pug files
//

gulp.task('jade', function () {
  'use strict';
  return gulp.src('jade/index.pug')
    .pipe(pug())
    .pipe(gulp.dest('app/'));
});

/**
 * *
 * * Styles
 * * - Compile
 * * - Compress/Minify
 * * - Catch errors (gulp-plumber)
 * * - Autoprefixer
 * *
 * **/
gulp.task('sass', function() {
  gulp.src('app/sass/*.scss')
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(cssnano())
  .pipe(plumber())
  .pipe(gulp.dest('app/css'));
});

/**
 * *
 * * BrowserSync.io
 * * - Watch CSS, JS & HTML for changes
 * * - View project at: localhost:3000
 * *
 * **/
gulp.task('browser-sync', function() {
  browserSync.init(['app/css/*.css', 'app/js/*.js', 'app/index.html'], {
    server: {
      baseDir: 'app/'
    }
  });
});


/**
 * * Prepearing Vendors JS
 * * Javascript
 * * - Uglify
 * *
 * **/
gulp.task('vendor-scripts', function() {
  // gulp.src(['bower_components/bootstrap-material-design/scripts#<{(|.js', 'bower_components/jquery/dist#<{(|.js'])
  gulp.src(['bower_components/jquery/dist/jquery.min.js','bower_components/bootstrap/dist/js/bootstrap.min.js'])
  // .pipe(uglify())
  .pipe(concat('vendor.min.js'))
  .pipe(gulp.dest('app/js'));
});

gulp.task('scripts', function() {
  // gulp.src(['bower_components/bootstrap-material-design/scripts#<{(|.js', 'bower_components/jquery/dist#<{(|.js'])
  gulp.src('app/coffee/*')
  .pipe(uglify())
  .pipe(rename('app/js/scripts.min.js'))
  .pipe(gulp.dest('app/js'));
});


/**
 * *
 * * Images
 * * - Compress them!
 * *
 * **/
gulp.task('images', function () {
  return gulp.src('app/images/*')
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  }))
  .pipe(gulp.dest('img'));
});


/**
 * *
 * * Default task
 * * - Runs sass, browser-sync, scripts and image tasks
 * * - Watchs for file changes for images, scripts and sass/css
 * *
 * **/
gulp.task('default', ['jade', 'sass', 'browser-sync', 'scripts', 'images'], function () {
  gulp.watch('app/sass/*.scss', ['sass']);
  gulp.watch('app/*.js', ['scripts']);
  gulp.watch('app/images/*', ['images']);
  gulp.watch('jade/*', ['jade']);
});
