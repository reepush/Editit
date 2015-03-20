var fs    = require('fs'),
    async = require('async'),
    Deferred    = require('deferred'),
    Path  = require('path')

var DIR = Path.join(process.cwd(), 'test')

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

module.exports = filesystem
