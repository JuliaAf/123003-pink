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
var copy = require("gulp-contrib-copy");
var clean = require("gulp-contrib-clean");


gulp.task("style", function() {
  gulp.src("less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer({browsers: [/*не работает*/
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
    .pipe(gulp.dest("build/css/style.css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css/style.css"))
    .pipe(server.reload({stream: true}));
});

gulp.task("images", function(){
  return gulp.src("img/**/*.{png,jpg,gif}")
  .pipe(imagemin({
    optimizationLevel:3,
    progressive:true
  }))
  .pipe(gulp.dest("build/img"));
});

gulp.task("sprite", function () {
  return gulp.src("img/sprite/*.svg")
  .pipe(svgmin())
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img/sprite.svg"));
});

gulp.task("build", function(){
  return gulp.src([
    "fonts/**/*.{woff, woff2}",
    "img/**",/*картинки копируются не сжатые, надо где-то перечислить такси images и sprite*/
    "js/**",/*тоже надо минифицировать?*/
    "*.html"
  ])
  .pipe(clean("build"))
  // .pipe(style())
  .pipe(copy())       /*конфигурация html для слежения*/
  .pipe(gulp.dest("build"))
  .pipe(imagemin({
    optimizationLevel:3,
    progressive:true
  }))
});


/*надо ли остальные такси добавлять кроме style*/
gulp.task("serve", ["style"], function() {
  server.init({
    server: "build",
    notify: false,
    open: true,
    ui: false
  });


/*2 конфигурации style и html.*/
  gulp.watch("less/**/*.less", ["style"]);
  gulp.watch("*.html").on("change", server.reload);/*при изменении запускается таск copy:html*/
});
