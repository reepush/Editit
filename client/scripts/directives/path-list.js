var mPath = require('path')

module.exports = function(app) {

  app.directive('pathList', function() {
    return {
      restrict: 'A',
      templateUrl: 'path-list.html',
      scope: {
        path: '='
      },
      link: function(scope) {
        scope.dirClick = function(dir) {
          scope.path = dir.path
        }

        scope.$watch('path', function() {
          scope.dirs = getDirs(scope.path)
        })


        function getDirs(path) {
          var dirs = []

          while (mPath.basename(path)) {
            var dir = {
              name: mPath.basename(path),
              path: path
            }

            dirs.unshift(dir)
            path = mPath.join(path, '..')
          }

          return dirs
        }
      }
    }
  })
}

