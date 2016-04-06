"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync");
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var rimraf = require('rimraf');
var merge = require('merge-stream');
var uglify = require('gulp-uglify');

gulp.task('clean', function (cb) {
  rimraf('./build', cb);
});


gulp.task("style", ["clean"], function() {
  gulp.src("less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 1 version",
        "last 2 Chrome versions",
        "last 2 Firefox versions",
        "last 2 Opera versions",
        "last 2 Edge versions"
      ]}),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(gulp.dest("css"))
    .pipe(server.reload({stream: true}));
});


gulp.task("compress", ["style"], function(){
  var jss = gulp.src("js/**/*.js")
  .pipe(uglify())
  .pipe(rename("main-nav-open.min.js"))
  .pipe(gulp.dest("js"));

  var csss = gulp.src("css/**/*.css")
  .pipe(minify())
  .pipe(rename("style.min.css"))
  .pipe(gulp.dest("css"));

  return merge(jss, csss);
});

gulp.task("images", function(){
  return gulp.src("img/**/*.{png,jpg,gif}")
  .pipe(imagemin({
    optimizationLevel:3,
    progressive:true
  }))
  .pipe(gulp.dest("img/compressed"));
});

gulp.task("sprite", function () {
  return gulp.src("img/sprite/*.svg")
  .pipe(svgmin())
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("img"));
});

gulp.task("build", ["compress"], function(){
  var htmls = gulp.src("*.html")
  .pipe(gulp.dest("build"));

  var csss = gulp.src("css/**/*.css")
  .pipe(gulp.dest("build/css"));

  var fonts = gulp.src("fonts/**/*{woff,woff2}")
  .pipe(gulp.dest("build/fonts"));

  var jss = gulp.src("js/**/*.js")
  .pipe(gulp.dest("build/js"));

  var images = gulp.src("img/compressed/*.*")
  .pipe(gulp.dest("build/img"));

  return merge(htmls, csss, fonts, jss, images);
});


gulp.task("serve", ["style"], function() {
  server.init({
    server: ".",
    notify: false,
    open: true,
    ui: false
});
  gulp.watch("less/**/*.less", ["style"]);
  gulp.watch("*.html").on("change", server.reload);
});
