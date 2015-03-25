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
require('./directives/highlight.js')(app)

require('./services/filesystem.js')(app)
require('./services/files.js')(app)

require('../../node_modules/codemirror/mode/xml/xml.js')
require('../../node_modules/codemirror/mode/javascript/javascript.js')
require('../../node_modules/codemirror/mode/shell/shell.js')
require('../../node_modules/codemirror/mode/css/css.js')
require('../../node_modules/codemirror/mode/jade/jade.js')

