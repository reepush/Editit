module.exports = function(app) {
  app.controller('searchController', function($scope, filesystem, $rootScope) {

    $scope.processQuery = function() {
      filesystem.search($scope.query, function(results) {
        $scope.results = results
      })
    }

    $scope.resultClick = function(result) {
      $rootScope.$emit('editor:add', result.filename, result.path)
      $scope.$parent.activateTab('editor')
    }
  })

}
