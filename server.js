var express     = require('express'),
    bodyParser  = require('body-parser'),
    async       = require('async'),
    fs          = require('fs'),
    http        = require('http'),
    Path        = require('path'),
    Grep        = require('grep1'),
    Deferred    = require('deferred');

var app = express();

var DIR = process.cwd();
DIR = Path.join(DIR, 'test');

var filesystem = {
  list: function(path, callback) {
    var relativePath = path;
    path = Path.join(DIR, path);

    listNodes(path).
      then(getStats).
      then(function(nodes) {
        callback(nodes);
      });


    /******************************/

    function listNodes(path) {
      var deferred = new Deferred();

      fs.readdir(path, function(err, nodes) {
        deferred.resolve(nodes);
      });

      return deferred.promise;
    }

    function getStats(nodes) {
      var deferred = new Deferred();
      var result = [];

      async.each(nodes,
        function(node, callback) {
          var nodePath = Path.join(path, node);
          fs.stat(nodePath,
            function(err, stats) {
              var item = {
                name: node,
                isFile: stats.isFile(),
                isDir: stats.isDirectory(),
                path: Path.join(relativePath, node)
              };

              result.push(item);
              callback();
            }
          );
        },
        function() {
          deferred.resolve(result);
        }
      );

      return deferred.promise;
    }
  },
  read: function(path, callback) {
    path = Path.join(DIR, path);

    fs.readFile(path,
      { encoding: 'utf-8' },
      function(err, content) {
        callback({ content: content });
      }
    );
  },
  write: function(path, data, callback) {
    path = Path.join(DIR, path);

    fs.writeFile(path, data, function(err) {
      callback(true);
    });
  }
};

app.use('/', express.static(Path.join(__dirname, 'client/public')));
app.use('/fonts/bootstrap/', express.static(Path.join(__dirname, 'bower_components/bootstrap-sass/assets/fonts/bootstrap/')))
app.use(bodyParser.json());

app.post( '/list',
  function(req, res) {
    filesystem.list(req.body.path,
      function(nodes) {
        res.json(nodes);
      }
    );
  }
);

app.post( '/read',
  function(req, res) {
    filesystem.read(req.body.path,
      function(content) {
        res.json(content);
      }
    );
  }
);

app.post( '/write',
  function(req, res) {
    filesystem.write(req.body.path, req.body.data,
      function(status) {
        res.json(status);
      }
    );
  }
);

app.post('/search',
  function(req, res) {
    grepify(req.body.query, function(results) {
      res.json(results);
    });
  }
);

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
