module.exports = function(app) {
  app.controller('appController', function($scope, editors, $location, $rootScope) {

    $scope.$watch(function() {
      return $location.path()
    }, function() {
      $scope.activateTab($location.path().slice(1))
    })

    $scope.activateTab = function(tab) {
      $scope.activeTab = {}
      $scope.activeTab[tab] = true
      $location.path(tab)
    }

    $scope.editorDisabled = true
    editors.subscribe(function() {
      $scope.editorDisabled = false
    })
  })
}
