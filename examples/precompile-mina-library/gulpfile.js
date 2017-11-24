const gulp = require('gulp')
const del = require('del')
const babel = require('gulp-babel')
const postcss = require('gulp-postcss')
const uglify = require('gulp-uglify')
const jsonMinify = require('gulp-json-minify')
const cleanCSS = require('gulp-clean-css')
const mina = require('../..')

gulp.task('default', ['clean'], () => {
  return gulp.src('../../test/fixtures/source/*.mina')
    .pipe(mina({
      script: (stream) => stream.pipe(babel({ presets: ['env'] })).pipe(uglify()),
      config: (stream) => stream.pipe(jsonMinify()),
      style: (stream) => stream.pipe(postcss([require('precss')])).pipe(cleanCSS()),
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('clean', () => del(['./dist']))
