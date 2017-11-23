const through = require('through2')
const gutil = require('gulp-util')
const replaceExt = require('replace-ext')
const { parse } = require('@tinajs/mina-sfc')
const PluginError = gutil.PluginError

const PLUGIN_NAME = 'gulp-mina'

const BLOCK_TYPES = ['config', 'style', 'template', 'script']
const EXTNAMES = {
  config: 'json',
  style: 'wxss',
  template: 'wxml',
  script: 'js',
}

function mina (mapping, isSplit) {
  mapping = mapping || {}
  isSplit = isSplit || false

  return through.obj(function(file, encoding, callback) {
    var sfc, subStreams, next
    if (file.isNull()) {
      return callback(null, file)
    }
    if (file.isStream()) {
      return callback(new PluginError(PLUGIN_NAME, 'Stream file is unsupported yet.'))
    }
    if (file.isBuffer()) {
      if (!file.path) {
        return callback(new PluginError(PLUGIN_NAME, 'The path of file is required.'))
      }
      sfc = parse(file.contents.toString())
      next = file.clone()
      next.contents = new Buffer('')
      subStreams = BLOCK_TYPES
        .map((type) => {
          var subFile, stream
          if (!sfc[type] || !sfc[type].content) {
            return null
          }

          subFile = file.clone()
          subFile.path = replaceExt(subFile.path, '.' + EXTNAMES[type])
          subFile.contents = new Buffer(sfc[type].content)

          stream = through.obj()
          stream.write(subFile)
          if (typeof mapping[type] === 'function') {
            stream = mapping[type](stream)
          }

          return stream.pipe(through.obj((file, encoding, callback) => {
            if (isSplit) {
              this.push(file)
            } else {
              next.contents = Buffer.concat([next.contents, wrap(sfc[type])(file.contents)])
            }
            callback()
          }))
        })
    }
    if (isSplit) {
      callback()
    } else {
      callback(null, next)
    }
  })
}

function wrap ({ type, attributes }) {
  function appendAttribute (attr) {
    if (!attr.value) {
      return ` ${attr.name}`
    }
    return ` ${attr.name}="${attr.value}"`
  }
  return (content) => Buffer.concat([new Buffer(`<${type}${attributes.map(appendAttribute)}>\n`), content, new Buffer(`\n</${type}>\n`)])
}

module.exports = (mapping) => mina(mapping, false)
module.exports.split = (mapping) => mina(mapping, true)
