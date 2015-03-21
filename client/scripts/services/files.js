module.exports = function(app) {
  var _ = require('lodash')

  app.factory('files', function() {
    var MAX_FILES = 5

    var files = []
    var observers = []
    var activePrev

    var methods = {
      publish: function() {
        observers.forEach(function(observer) {
          observer(files)
        })
      },
      subscribe: function(observer) {
        observers.push(observer)
        observer(files)
      },
      add: function(name, path) {
        files.map(function(file) {
          if (file.active)
            activePrev = file

          file.active = false
          return file
        })

        // find if this file was already opened
        var opened = _.filter(files, { path: path })[0]
        if (!opened) {
          files.unshift({ name: name, path: path, active: true, line: 1 })
          files = files.slice(0, MAX_FILES)
        } else opened.active = true

        methods.publish()
      },
      active: function() {
        var active = files.filter(function(file) {
          if (file.active) {
            return file
          }
        })

        var result = {
          curr: active[0],
          prev: activePrev
        }
        activePrev = active[0]

        return result
      },
      activate: function(file) {
        files.map(function(file) {
          if (file.active)
            activePrev = file

          file.active = false
          return file
        })

        file.active = true
        methods.publish()
      }
    }

    return methods
  })
}
