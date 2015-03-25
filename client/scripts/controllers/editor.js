module.exports = function(app) {
  app.controller('editorController', function($scope, filesystem, files) {
    var path = require('path')
    var editor
    $scope.content = ''

    files.subscribe(function(list) {
      $scope.files = list

      var active = files.active()
      /* there are no active files at startup */
      if (!active.curr) return

      // set mode for highlighting
      var ext = path.extname(active.curr.name).slice(1)
      // TODO: find extension to MIME thing
      // TODO: autoload modes
      var ext2mode = {
        'js'  : 'text/javascript',
        'html': 'text/html',
        'sh'  : 'text/x-sh',
        'css' : 'text/css',
        'jade': 'text/x-jade',
        'json': 'application/json',
      }
      var mode = ext2mode[ext]
      console.log(mode)
      $scope.cmOptions.mode = mode

      if (active.prev) {
        active.prev.content = $scope.content
        filesystem.write(active.prev.path, active.prev.content)
      }

      if (!active.curr.content) {
        filesystem.read(active.curr.path,
          function(data) {
            active.curr.content = data.content
            $scope.content = data.content
            // editor.scrollToLine(20)
          }
        )
      } else {
        $scope.content = active.curr.content
        // editor.scrollToLine(20)
      }
    })

    $scope.fileClick = function(file) {
      files.activate(file)
      // editor.scrollToLine(20)
    }

    $scope.cmOptions = {
       lineNumbers: true,
       theme: 'lesser-dark',
       onLoad: function(cm) {
         editor = cm
         editor.scrollToLine = function(line) {
          var coords = this.charCoords({line: line-1, ch: 0}, "local") 
          this.scrollTo(null, coords.top) 
         }
       }
    }
  })
}
