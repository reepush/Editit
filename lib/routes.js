var filesystem = require('./filesystem'),
    grepy      = require('grepy'),
    _          = require('lodash'),
    path       = require('path'),
    fs         = require('fs'),
    escape     = require('escape-html')

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
    greps = transformContent(greps)
    res.json(greps)
  })
}

function transformContent(greps) {
  greps.forEach(function(grep) {
    grep.content = _.pluck(grep.lines, 'content').join('\n')
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
        var content = line.chunks.map(function(chunk) {
          chunk.str = escape(chunk.str)
          if (chunk.matched)
            return '<span class="matched">' + chunk.str + '</span>'
          else
            return chunk.str
        }).join('')
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

