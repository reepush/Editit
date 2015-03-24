module.exports = function(app) {
  var hljs = require('highlight.js')

  app.directive('highlight', function() {
    return function(scope, element, attr) {
      element.html(scope.$eval(attr.highlight))

      // set file type
      hljs.configure({ languages: ['html'] })

      hljs.highlightBlock(element[0])
    }
  })
}

