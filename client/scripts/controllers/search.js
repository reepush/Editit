module.exports = function(app) {
  app.controller('searchController', function($scope, filesystem, files) {
    $scope.processQuery = function() {
      filesystem.search($scope.query, function(results) {
        $scope.results = results
      })
    }

    $scope.resultClick = function(result) {
      files.add(result.filename, result.path)
      $scope.$parent.activateTab('editor')
    }
  })
}
