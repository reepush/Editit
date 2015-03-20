var express     = require('express'),
    bodyParser  = require('body-parser'),
    http        = require('http'),
    Path        = require('path'),
    Grep        = require('grep1'),
    filesystem  = require('./lib/filesystem'),
    routes      = require('./lib/routes')

var app = express();
var DIR = Path.join(process.cwd(), 'test')

app.use('/', express.static(Path.join(__dirname, 'client/public')));
app.use('/fonts/bootstrap/', express.static(Path.join(__dirname, 'bower_components/bootstrap-sass/assets/fonts/bootstrap/')))
app.use(bodyParser.json());

app.post( '/list', routes.list)
app.post( '/read', routes.read)
app.post( '/write', routes.write)
app.post( '/search', routes.search)

function grep(query, dir, callback) {
  Grep([
        '--recursive',
        '--ignore-case',
        '--line-number',
        '--context=3',
        query,
        dir
      ],
      function(err, stdout, stderr) {
        callback(err, stdout, stderr);
      }
  );
}


function grepify(query, callback) {
  grep(query, DIR,
    function(err, stdout, stderr) {
      var grepResult = [];

      files = stdout.split('\n--\n');
      files.forEach(function(file) {
        var path;
        var fileResult = { lines: [] };

        var lines = file.split('\n');
        lines.forEach(function(line) {
          var regexp = /(.+)[-:](\d+)[-:](.*)/;
          var matches = regexp.exec(line);
          if (matches) {
            path = matches[1];
            fileResult.lines.push({
              number: matches[2],
              content: matches[3]
            });
          }
        });
        if (path) {
          path = path.replace(DIR, '');
        }
        fileResult.path = path;
        fileResult.filename = Path.basename(path);
        grepResult.push(fileResult);
      });

      callback(grepResult);
    }
  );
}

app.listen(3001);
