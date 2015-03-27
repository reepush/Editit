module.exports = function(app) {

  app.factory('filesystem', function($http) {
    return {
      list: function(path, callback) {
        $http.post('/list', { path: path })
          .success(function(data) {
            callback(data)
          }
        )
      },
      read: function(path, callback) {
        $http.post('/read', { path: path })
          .success(function(data) {
            callback(data)
          }
        )
      },
      write: function(path, data, cb) {
        $http.post('/write', { path: path, data: data })
          .success(function() {
            cb()
          }
        )
      },
      search: function(query, callback) {
        $http.post('/search', { query: query })
          .success(function(data) {
            callback(data)
          }
        )
      }
    }
  })
}
