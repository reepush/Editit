// TODO: make some modules lazy (class / function)
var Path       = require('path')
var minimist   = require('minimist')
var args = minimist(process.argv.slice(2))

// detect heroku
if (process.env.DYNO)
  args.dir = Path.join(process.cwd(), 'test')

var DIR = args.dir || process.cwd()
process.chdir(DIR)

var express     = require('express'),
    bodyParser  = require('body-parser'),
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

var port = process.env.PORT || 3001
app.listen(port, function() {
  console.log('Ok! Open http://localhost:' + port + '/')
});

