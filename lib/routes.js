var filesystem = require('./filesystem'),
    grepy      = require('grepy'),
    _          = require('lodash'),
    path       = require('path'),
    hljs       = require('highlight.js'),
    fs         = require('fs')

exports.list = function(req, res) {
  filesystem.list(req.body.path,
    function(nodes) {
      res.json(nodes);
    }
  )
}

exports.read = function(req, res) {
  filesystem.read(req.body.path,
    function(content) {
      res.json(content);
    }
  )
}

exports.write = function(req, res) {
  filesystem.write(req.body.path, req.body.data,
    function(status) {
      res.json(status);
    }
  )
}

exports.search = function(req, res) {
  var args = grepy.defaultArgs.concat('--recursive', '--ignore-case', '--context=3')
  grepy(req.body.query, '.', args, function(lines) {
    var greps = transformLines(lines)
    greps = highlight(greps)
    res.json(greps)
  })
}

function highlight(greps) {
  hljs.configure({ tabReplace: true })

  greps.forEach(function(grep) {
    var lines
    lines = grep.lines.map(function(line) {
      return line.number
    })
    grep.lines = lines


    var content = ''
    var file = fs.readFileSync(grep.filename, 'utf8')
    file = hljs.highlightAuto(file).value
    file = hljs.fixMarkup(file)
    file = file.split('\n')
    // zero-base to one-base
    file.unshift('zero')
    grep.lines.forEach(function(line) {
      content += file[line] + '<br>'
    })
    grep.content = content
  })

  return greps
}

function transformLines(lines) {
  var filenames = _.chain(lines)
    .pluck('filename')
    .uniq()
    .value()

  var result = _.chain(filenames).map(function(filename) {
    var fileLines = _.chain(lines)
      .filter({ filename: filename })
      .map(function(line) {
        var content = _.pluck(line.chunks, 'str').join('')
        return { content: content, number: line.lineNumber }
      })
      .value()
    return {
      path: filename,
      filename: path.basename(filename),
      lines: fileLines
    }
  })
  .value()

  return result
}

