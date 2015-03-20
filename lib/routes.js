var filesystem = require('./filesystem'),
    grepy      = require('grepy'),
    _          = require('lodash'),
    path       = require('path')

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
  var args = grepy.defaultArgs.concat('--recursive', '--ignore-case')
  grepy(req.body.query, '.', args, function(lines) {
    res.json(transformLines(lines))
  })
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

