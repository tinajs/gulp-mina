const fs = require('fs')
const path = require('path')
const test = require('ava')
const es = require('event-stream')
const File = require('vinyl')
const babel = require('gulp-babel')
const mina = require('..')

const fixture = {
  source: (filename) => path.join(__dirname, './fixtures/source/', filename),
  expect: (filename) => path.join(__dirname, './fixtures/expect/', filename),
}

test('compiling-library', async (t) => {
  t.plan(1)

  const file = new File({
    contents: fs.readFileSync(fixture.source('component.mina')),
    path: fixture.source('component.mina'),
  })
  const stream = mina({
    script: (stream) => stream.pipe(babel({ presets: ['env'] })),
  })

  stream.write(file)
  stream.on('data', (file) => {
    t.is(file.contents.toString(), fs.readFileSync(fixture.expect('component.mina'), 'utf8'))
  })
})

test('split-files', async (t) => {
  t.plan(4)

  const file = new File({
    contents: fs.readFileSync(fixture.source('component.mina')),
    path: fixture.source('component.mina'),
  })
  const stream = mina.split({
    script: (stream) => stream.pipe(babel({ presets: ['env'] })),
  })
  const expects = [
    fs.readFileSync(fixture.expect('component.json'), 'utf8'),
    fs.readFileSync(fixture.expect('component.wxss'), 'utf8'),
    fs.readFileSync(fixture.expect('component.wxml'), 'utf8'),
    fs.readFileSync(fixture.expect('component.js'), 'utf8'),
  ]

  let index = 0
  stream.write(file)
  stream.on('data', (file) => {
    t.is(expects[index++], file.contents.toString())
  })
})
