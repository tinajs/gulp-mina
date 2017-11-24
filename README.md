# gulp-mina
> split/precompile mina single-file-component

## Install
```bash
npm install --save-dev @tinajs/gulp-mina
```

## Usage
### Precompile mina singlet-file-componen library
```javascript
const gulp = require('gulp')
const babel = require('gulp-babel')
const mina = require('@tinajs/gulp-mina')

gulp.task('default', () => {
  return gulp.src('src/**/*.mina')
    .pipe(mina({
      script: (stream) => stream.pipe(babel({ presets: ['env'] })),
    }))
    .pipe(gulp.dest('dist'))
})
```

[Example (more complicated)](./examples/precompile-mina-library)

### Split mina single-file-component to a group of files (``wxml``, ``wxss``, ``json`` and ``js``)
```javascript
const gulp = require('gulp')
const babel = require('gulp-babel')
const mina = require('@tinajs/gulp-mina')
gulp.task('default', ['clean'], () => {
  return gulp.src('src/**/*.mina')
    .pipe(mina.split({
      script: (stream) => stream.pipe(babel({ presets: ['env'] })),
    }))
    .pipe(gulp.dest('dist'))
})
```

[Example](./examples/split-to-a-group-of-files)

## API
### mina([mapping])
Separate mina-sfc to multiple streams, and pipe the recombined results out. 

#### mapping
Type: ``Object``  
Default: {}  

Each separated streams of mina-sfc file will be passed to this mapping.

##### script
Type: ``Function``  

Receive the stream of ``<script>`` part as a ``.js`` file.

##### config
Type: ``Function``  

Receive the stream of ``<config>`` part as a ``.json`` file.

##### style
Type: ``Function``  

Receive the stream of ``<style>`` part as a ``.wxss`` file.

##### template
Type: ``Function``  

Receive the stream of ``<template>`` part as a ``.wxml`` file.

### mina.split([mapping])
Just like ``mina([mapping])``, but pipe separated mina-sfc as multiple files to the downstream.

## Related
- [gulp](https://github.com/gulpjs/gulp)
- [mina-sfc](https://github.com/tinajs/mina-sfc)

## License
MIT @ [yelo](https://github.com/imyelo)
