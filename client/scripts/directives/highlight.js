var hljs = require('highlight.js')

module.exports = function(app) {

  app.directive('highlight', function() {
    return function(scope, element, attr) {
      element.html(scope.$eval(attr.highlight))

      hljs.highlightBlock(element[0])
    }
  })
}

