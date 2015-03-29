var express     = require('express'),
    bodyParser  = require('body-parser'),
    http        = require('http'),
    Path        = require('path'),
    Grep        = require('grep1'),
    filesystem  = require('./lib/filesystem'),
    routes      = require('./lib/routes')

var app = express();
var DIR = Path.join(process.cwd(), 'test')
process.chdir('test')

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

