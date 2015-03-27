module.exports = function(app) {
  app.controller('editorController', function($scope, filesystem, editors) {
    var path = require('path')
    var _    = require('lodash')
    var codemirror = require('codemirror')
    var editor
    $scope.content = ''

    codemirror.commands.save = function(cm) {
      var editor = editors.active()
      $scope.save(editor)
    }

    editors.subscribe(function(list) {
      $scope.editors = list

      var active = editors.active()
      /* there are no active files at startup */
      if (!active) return

      if (!active.content) {
        filesystem.read(active.filepath, function(data) {
          active.content = data.content
        })
      }
    })

    $scope.activateEditor = function(editor) {
      $scope.editors.forEach(function(editor) {
        editor.active = false
      })
      editor.active = true
    }

    $scope.save = function(editor) {
      filesystem.write(editor.filepath, editor.content, function() {
        editor.saved = true
      })
    }

  })
}

