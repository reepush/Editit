// TODO: make some modules lazy (class / function)
var minimist   = require('minimist')
var args = minimist(process.argv.slice(2))
var DIR = args.cwd || process.cwd()
process.chdir(DIR)

var express     = require('express'),
    bodyParser  = require('body-parser'),
    Path        = require('path'),
    routes      = require('./lib/routes')

var app = express();

app.use(bodyParser.json());

app.use('/', express.static(Path.join(__dirname, 'client/public')));
app.use('/fonts', express.static(Path.join(__dirname, 'node_modules/bootstrap/dist/fonts')))
app.use('/mode', express.static(Path.join(__dirname, 'node_modules/codemirror/mode')))
app.use('/*', express.static(Path.join(__dirname, 'client/public/index.html')))

app.post( '/list', routes.list)
app.post( '/read', routes.read)
app.post( '/write', routes.write)
app.post( '/search', routes.search)

app.listen(3001);

