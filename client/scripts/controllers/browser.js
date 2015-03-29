module.exports = function(app) {
  var mPath = require('path')

  app.controller('browserController', function($scope, filesystem, $rootScope) {
    $scope.path = '/'

    $scope.nodeClick = function(node) {
      if (!node.isFile) {
        $scope.path = mPath.join($scope.path, node.name)
      } else {
        $rootScope.$emit('editor:add', node.name, node.path)
        $scope.$parent.activateTab('editor')
      }
    }

    $scope.$watch('path', function() {
      $scope.rootDir = ($scope.path == '/') ? true : false

      filesystem.list($scope.path,
        function(nodes) {
          $scope.nodes = nodes
        }
      )
    })

  })
}
