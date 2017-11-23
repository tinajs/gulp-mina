const through = require('through2')
const gutil = require('gulp-util')
const PluginError = gutil.PluginError

const PLUGIN_NAME = 'gulp-mina'

function mina () {
  return through.obj(function(file, encoding, cb) {
    cb(null, file)
  })
}

module.exports = mina
