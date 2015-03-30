require('angular')
global.CodeMirror = require('codemirror')
require('angular-ui-codemirror')

var app = angular.module('app', ['ui.codemirror'])
app.config(function($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  })
})

require('./controllers/main.js')(app)
require('./controllers/search.js')(app)
require('./controllers/browser.js')(app)
require('./controllers/editor.js')(app)

require('./directives/path-list.js')(app)
require('./directives/highlight.js')(app)
require('./directives/when-hovered.js')(app)

require('./services/filesystem.js')(app)

require('../../node_modules/codemirror/mode/meta.js')
require('../../node_modules/codemirror/addon/mode/loadmode.js')

