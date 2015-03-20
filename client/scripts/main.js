require('angular')
global.CodeMirror = require('codemirror')
require('angular-ui-codemirror')
require('angular-bootstrap')

var app = angular.module('app', ['ui.codemirror', 'ui.bootstrap'])

require('./controllers/main.js')(app)
require('./controllers/search.js')(app)
require('./controllers/browser.js')(app)
require('./controllers/editor.js')(app)

require('./directives/path-list.js')(app)

require('./services/filesystem.js')(app)
require('./services/files.js')(app)

