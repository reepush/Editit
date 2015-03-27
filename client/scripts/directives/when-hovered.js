module.exports = function(app) {

  app.directive('whenHovered', function() {
    return function(scope, element, attr) {
      var options = JSON.parse(attr.whenHovered)

      var target
      if (options.selector == 'parent')
        target = element.parent()

      element
        .bind('mouseenter', function() { target.addClass('hovered') })
        .bind('mouseleave', function() { target.removeClass('hovered') })
    }
  })
}

