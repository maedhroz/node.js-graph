var PooledConnection = require('cassandra-client').PooledConnection;

var hosts = [ 'localhost:9160' ];
var pool = new PooledConnection({ 'hosts' : hosts, 'keyspace' : 'Graphs', 'use_bigints' : true });

pool.on('log', function(level, message, obj) {
  console.log('Log event: %s -- %j', level, message);
});

exports.following = function(req, res, next) {
  pool.execute('SELECT * FROM Following WHERE KEY=?', [ req.params.id ],
      function(err, rows) {
        if (err) {
          res.send(err);
        } else {
          var following = [];

          for ( var i = 0; i < rows[0].colCount(); i++) {
            var stringValue = rows[0].cols[i].value.toString();
            following.push(parseInt(stringValue, 10));
          }

          res.send({ 'following' : following });
        }
      });

  return next();
};

exports.postFollowing = function(req, res, next) {
  var milliseconds = new Date().getTime();
  var id = req.params.id;
  var follow = req.params.follow;

  pool.execute('UPDATE Following SET ?=? WHERE KEY=?', [ follow, milliseconds, id ], function(err, row) {
    if (err) {
      res.send(err);
    } else {
      res.send('%d is now following %d', req.params.id, req.params.follow);
    }
  });

  return next();
};

exports.shutdown = function() {
  pool.shutdown(function() {
    console.log("Connection pool shutting down...");
  });
};
