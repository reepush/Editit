module.exports = function(app) {
  app.controller('appController', function($scope, editors) {
    $scope.activeTab = { browser: true }

    $scope.activateTab = function(tab) {
      $scope.activeTab[tab] = true
    }

    $scope.editorDisabled = true
    editors.subscribe(function() {
      $scope.editorDisabled = false
    })
  })
}
