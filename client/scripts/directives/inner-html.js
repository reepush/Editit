module.exports = function(app) {

  app.directive('innerHtml', function() {
    return function(scope, element, attr) {
      scope.$watch(attr.innerHtml, function(value) {
        console.log(scope.$eval(attr.innerHtml))
        element.html(scope.$eval(attr.innerHtml))
      })
    }
  })
}

