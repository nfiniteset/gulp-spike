var gulp = require('gulp');
var include = require("gulp-include");
var gulpif = require("gulp-if");
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var sass = require("gulp-sass");
var rev = require("gulp-rev");
var uglify = require("gulp-uglify");
var minify = require("gulp-minify-css");
var shell = require("gulp-shell");
var bourbon = require('node-bourbon');
var neat = require('node-neat');

var assets = [
  'assets/scripts/application.js',
  'assets/styles/application.scss'
]

// Development
// -----------------------------------------------------------

gulp.task("assets:compile", function() {
  gulp.src(assets)
    .pipe(include())
    .pipe(sourcemaps.init())
      .pipe(gulpif('*.js', babel()))
      .pipe(gulpif('*.scss', sass({
        includePaths: neat.includePaths
      })))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("public/assets"))
    .pipe(rev())
    .pipe(gulp.dest("public/assets")) // file with digest
    .pipe(rev.manifest({path: 'manifest.json'}))
    .pipe(gulp.dest("public/assets")) // manifest.json
});

gulp.task("server", ["assets:compile"], function() {
  gulp.src('').pipe(shell('echo Define a task to run your server in gulpfile.js'));
  gulp.watch(['app/assets/**/*.js', 'app/assets/**/*.scss'], ["assets:compile"]);
});

gulp.task("test", ["assets:compile"], function() {
  gulp.src('').pipe(shell('echo Define a task to run your tests in gulpfile.js'));
});

// Production
// -----------------------------------------------------------

gulp.task("assets:precompile", function() {
  gulp.src(assets)
    .pipe(include())
    .pipe(gulpif('*.js', babel()))
    .pipe(gulpif('*.scss', sass({
      includePaths: neat.includePaths
    })))
    .pipe(gulpif('*.css', minify()))
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulp.dest("public/assets")) // file without digest
    .pipe(rev())
    .pipe(gulp.dest("public/assets")) // file with digest
    .pipe(rev.manifest({path: 'manifest.json'}))
    .pipe(gulp.dest("public/assets")) // manifest.json
});
