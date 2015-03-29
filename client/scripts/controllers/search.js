module.exports = function(app) {
  app.controller('searchController', function($scope, filesystem, editors) {

    $scope.processQuery = function() {
      filesystem.search($scope.query, function(results) {
        $scope.results = results
      })
    }

    $scope.resultClick = function(result) {
      editors.add(result.filename, result.path)
      $scope.$parent.activateTab('editor')
    }
  })

}
