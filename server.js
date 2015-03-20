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

app.use('/', express.static(Path.join(__dirname, 'client/public')));
app.use('/fonts/bootstrap/', express.static(Path.join(__dirname, 'bower_components/bootstrap-sass/assets/fonts/bootstrap/')))
app.use(bodyParser.json());

app.post( '/list', routes.list)
app.post( '/read', routes.read)
app.post( '/write', routes.write)
app.post( '/search', routes.search)

app.listen(3001);

