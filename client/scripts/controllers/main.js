module.exports = function(app) {
  app.controller('appController', function($scope) {
    $scope.activeTab = { browser: true }

    $scope.activateTab = function(tab) {
      $scope.activeTab[tab] = true
    }
  })
}
