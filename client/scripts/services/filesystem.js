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
      write: function(path, data) {
        $http.post('/write', { path: path, data: data })
          .success(function() {
            console.log('data were written')
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
