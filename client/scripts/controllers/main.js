module.exports = function(app) {
  app.controller('appController', function($scope, $location, $rootScope) {

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
    $rootScope.$on('editor:add', function() {
      $scope.editorDisabled = false
    })
  })
}
