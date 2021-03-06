const Promise = require('bluebird')
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
      Promise.map(BLOCK_TYPES, (type) => {
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

        return new Promise((resolve, reject) => {
          stream.pipe(through.obj((file, encoding, callback) => {
            if (isSplit) {
              this.push(file)
            } else {
              next.contents = Buffer.concat([next.contents, wrap(sfc[type])(file.contents)])
            }
            resolve()
            callback()
          }))
        })
      }).then(() => {
        if (isSplit) {
          callback()
        } else {
          callback(null, next)
        }
      }, (error) => {
        callback(error)
      })
    }
  })
}

function wrap ({ type, attributes }) {
  function appendAttribute (memory, value, name) {
    if (!value) {
      return `${memory} ${name}`
    }
    return `${memory} ${name}="${value}"`
  }
  return (content) => Buffer.concat([new Buffer(`<${type}${reduce(attributes, appendAttribute, '')}>\n`), content, new Buffer(`\n</${type}>\n`)])
}

function reduce (object, iteratee, initial) {
  var memory = initial
  for (key in object) {
    memory = iteratee(memory, object[key], key, object)
  }
  return memory

}

module.exports = (mapping) => mina(mapping, false)
module.exports.split = (mapping) => mina(mapping, true)
