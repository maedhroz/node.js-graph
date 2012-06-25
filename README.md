node.js-graph
=======================

Work in progress on a social graph built with Node.js &amp; Cassandra

To run it, you'll need to install restify and node-cassandra-client...

	npm install restify
	npm install cassandra-client

...and you'll need to point the client in graph.js to a Cassandra cluster where you've created something like...

	create keyspace Graphs with placement_strategy = 'SimpleStrategy' and strategy_options = {replication_factor : 2};
	use Graphs;
	create column family Following with column_type = 'Standard' and comparator = 'LongType' and default_validation_class = 'LongType' and key_validation_class = 'LongType' and rows_cached = 0.0 and keys_cached = 0.0 and gc_grace = 259200;
