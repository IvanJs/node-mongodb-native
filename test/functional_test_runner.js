var Runner = require('integra').Runner
	, Cover = require('integra').Cover
	, NodeVersionFilter = require('./filters/node_version_filter')
	, MongoDBVersionFilter = require('./filters/mongodb_version_filter')
	, MongoDBTopologyFilter = require('./filters/mongodb_topology_filter')
	, FileFilter = require('integra').FileFilter;

/**
 * Standalone MongoDB Configuration
 */
var StandaloneConfiguration = function(context) {
	var Db = require('../lib/mongodb').Db;
	var Server = require('../lib/mongodb').Server;
	var ServerManager = require('../test/tools/server_manager').ServerManager;
  var database = "integration_tests";
  var serverManager = new ServerManager({
  	journal:false
  });

	return {		
		start: function(callback) {
      serverManager.start(true, function(err) {
        if(err) throw err;
        callback();
      });
		},

		shutdown: function(callback) {
      serverManager.killAll(function(err) {
        callback();
      });        
		},

		setup: function(callback) {
			callback();
		},

		teardown: function(callback) {
			callback();
		},

		newDbInstance: function(dbOptions, serverOptions) {
			return new Db(database, new Server("localhost", 27017, serverOptions), dbOptions);
		}
	}
}

// Set up the runner
var runner = new Runner({
		logLevel:'error'
	, runners: 1
	, failFast: true
});

var testFiles =[
		// '/test/tests/functional/mongo_reply_parser_tests.js'
  // , '/test/tests/functional/connection_pool_tests.js'
  // , '/test/tests/functional/gridstore/readstream_tests.js'
  // , '/test/tests/functional/gridstore/grid_tests.js'
  // , '/test/tests/functional/gridstore/gridstore_direct_streaming_tests.js'
  // , '/test/tests/functional/gridstore/gridstore_tests.js'
  // , '/test/tests/functional/gridstore/gridstore_stream_tests.js'
  // , '/test/tests/functional/gridstore/gridstore_file_tests.js'
  // , '/test/tests/functional/util_tests.js'
  // , '/test/tests/functional/multiple_db_tests.js'
  // , '/test/tests/functional/logging_tests.js'
  // , '/test/tests/functional/custom_pk_tests.js'
  // , '/test/tests/functional/geo_tests.js'
  // , '/test/tests/functional/write_preferences_tests.js'
  // , '/test/tests/functional/remove_tests.js'
  // , '/test/tests/functional/unicode_tests.js'
  // , '/test/tests/functional/raw_tests.js'
  // , '/test/tests/functional/mapreduce_tests.js'
  // , '/test/tests/functional/cursorstream_tests.js'
  // , '/test/tests/functional/index_tests.js'
  // , '/test/tests/functional/cursor_tests.js'
  // , '/test/tests/functional/find_tests.js'
  // , '/test/tests/functional/insert_tests.js'
  // , '/test/tests/functional/admin_mode_tests.js'
  // , '/test/tests/functional/aggregation_tests.js'
  // , '/test/tests/functional/exception_tests.js'
  // , '/test/tests/functional/error_tests.js'
  // , '/test/tests/functional/command_generation_tests.js'
  // , '/test/tests/functional/uri_tests.js'
  // , '/test/tests/functional/url_parser_tests.js'
  // , '/test/tests/functional/objectid_tests.js'
  // , '/test/tests/functional/connection_tests.js'
  // , '/test/tests/functional/collection_tests.js'
  // , '/test/tests/functional/db_tests.js'
  // , '/test/tests/functional/read_preferences_tests.js'
  // // , '/test/tests/functional/fluent_api/aggregation_tests.js'
  // , '/test/tests/functional/maxtimems_tests.js'
  // , '/test/tests/functional/mongo_client_tests.js'
  // , '/test/tests/functional/fluent_api/batch_write_ordered_tests.js'
  // , '/test/tests/functional/fluent_api/batch_write_unordered_tests.js'
  , '/test/tests/functional/fluent_api/batch_write_concerns_tests.js'
]

// Add all the tests to run
testFiles.forEach(function(t) {
	if(t != "") runner.add(t);
});
// runner.add('/test/tests/functional/aggregation_tests.js');


// // Add the Coverage plugin
// runner.plugin(new Cover({
// 	logLevel: "error"
// }));

// Add a Node version plugin
runner.plugin(new NodeVersionFilter());
// Add a MongoDB version plugin
runner.plugin(new MongoDBVersionFilter());
// Add a Topology filter plugin
runner.plugin(new MongoDBTopologyFilter());

// Exit when done
runner.on('exit', function(errors, results) {
	process.exit(0)
});

// Run the tests
runner.run(StandaloneConfiguration);