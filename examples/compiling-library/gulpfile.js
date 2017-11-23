const gulp = require('gulp')
const del = require('del')
const babel = require('gulp-babel')
const mina = require('../..')

gulp.task('default', ['clean'], () => {
  return gulp.src('../../test/fixtures/source/component.mina')
    .pipe(mina({
      script: (stream) => stream.pipe(babel({ presets: ['env'] }))
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('clean', () => del(['./dist']))
