const gulp = require('gulp')
const del = require('del')
const babel = require('gulp-babel')
const mina = require('../..')

gulp.task('default', ['clean'], () => {
  return gulp.src('../../test/fixtures/source/component.mina')
    /*
     * your don't need to splitting files like that:
     *
     * ```javascript
     * .pipe(mina({
     *   script: (stream) => stream.pipe(babel({ presets: ['env'] })).pipe(gulp.dest('./dist')),
     *   template: (stream) => stream.pipe(gulp.dest('./dist')),
     *   config: (stream) => stream.pipe(gulp.dest('./dist')),
     *   style: (stream) => stream.pipe(gulp.dest('./dist')),
     * }))
     * ```
     */
    .pipe(mina.split({
      script: (stream) => stream.pipe(babel({ presets: ['env'] })),
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('clean', () => del(['./dist']))
