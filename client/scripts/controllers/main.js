module.exports = function(app) {
  app.controller('appController', function($scope, $location, $rootScope) {

    // default tab is browser
    // editor is disabled at startup
    // so we are changing editor to browser
    if ($location.path() == '/' || $location.path() == '/editor')
      $location.path('browser')

    $scope.$watch(function() {
      return $location.path()
    }, function() {
      $scope.activateTab($location.path().slice(1))
    })

    $scope.activateTab = function(tab) {
      if (tab == 'editor' && $scope.editorDisabled)
        return

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
