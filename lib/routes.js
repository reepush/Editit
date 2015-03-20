var filesystem = require('./filesystem')

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
  res.json(false)
}
