var path       = require('path'),
    _          = require('lodash'),
    codemirror = require('codemirror')

module.exports = function(app) {
  app.controller('editorController', function($scope, filesystem, $rootScope) {
    codemirror.modeURL = 'mode/%N/%N.js'
    $scope.editors = []

    $rootScope.$on('editor:add', function(event, filename, filepath) {

      $scope.editors.map(function(editor) {
        editor.active = false
        return editor
      })

      var filtered = _.filter($scope.editors, { filepath: filepath })
      if (filtered.length) {
        filtered[0].active = true
      } else {
        var mode = codemirror.findModeByFileName(filename)
        if (mode.name == 'HTML') mode.name = 'XML'

        var editor = {
          filename: filename,
          filepath: filepath,
          active: true,
          saved: true,
          options: {
            lineNumbers: true,
            theme: 'lesser-dark',
            mode: mode.mime,
            onLoad: function(cm) {
              codemirror.autoLoadMode(cm, mode)

              var init = true
              cm.on('change', function() {
                if (!init || (init = false))
                  editor.saved = false
                cm.setOption('mode', cm.getOption('mode'))
              })
            }
          }
        }

        filesystem.read(editor.filepath, function(data) {
          editor.content = data.content
        })

        $scope.editors.unshift(editor)
        $scope.editors = $scope.editors.slice(0, 5)
      }
    })

    codemirror.commands.save = function(cm) {
      var editor = _.filter($scope.editors, { active: true })[0]
      $scope.save(editor)
    }

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

