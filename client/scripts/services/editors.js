module.exports = function(app) {
  var _ = require('lodash')
  var codemirror = require('codemirror')
  codemirror.modeURL = 'mode/%N/%N.js'

  app.factory('editors', function() {
    var MAX_FILES = 5

    var editors = []
    var observers = []
    var activePrev

    var methods = {
      publish: function() {
        observers.forEach(function(observer) {
          observer(editors)
        })
      },
      subscribe: function(observer) {
        observers.push(observer)
        observer(editors)
      },
      add: function(name, path) {
        editors.map(function(editor) {
          if (editor.active)
            activePrev = editor

          editor.active = false
          return editor
        })

        var opened = _.filter(editors, { filepath: path })[0]
        if (!opened) {

          // load mode
          var mode = codemirror.findModeByFileName(path)
          if (mode.name == 'HTML') mode.name = 'XML'
          console.log(mode)

          var editor = {
            filename: name,
            filepath: path,
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
                })}
            }
          }

          editors.unshift(editor)
          editors = editors.slice(0, MAX_FILES)
        } else opened.active = true

        methods.publish()
      },
      active: function() {
        var active = _.filter(editors, { active: true })

        return active[0]
      },
      activate: function(ile) {
        editors.map(function(editor) {
          editor.active = false
          return editor
        })

        editor.active = true
        methods.publish()
      }
    }

    return methods
  })
}
