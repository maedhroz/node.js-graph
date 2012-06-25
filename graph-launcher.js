var restify = require('restify');
var cluster = require('cluster');

var graph = require('./graph.js');

var numCores = require('os').cpus().length;

if (cluster.isMaster) {
  var workers = [];

  for ( var i = 0; i < numCores; i++) {
    workers.push(cluster.fork());
  }

  cluster.on('death', function(worker) {
    console.log('Worker ' + worker.pid + ' died');
  });

  function shutdown() {
    console.log("Closing...");
    graph.shutdown();
	    
    while (worker = workers.pop()) {
      console.log('Killing child ' + worker.pid);
      worker.kill('SIGQUIT');
    }

    process.exit(0);
  }

  process.on('SIGTERM', shutdown);
} else {
  var server = restify.createServer();
  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.bodyParser());

  server.get('/:id/following', graph.following);
  server.post('/:id/following', graph.postFollowing);

  server.listen(8080, function() {
    var milliseconds = new Date().getTime();
    console.log('%d - %s listening at %s', milliseconds, server.name, server.url);
  });

  process.on('SIGQUIT', function() {
    console.log('Killing restify...');
    server.close();
  });
}
