/**
 * @find Port
 */
var net = require('net');
module.exports = function (port, callback) {
	var server = net.createServer().listen(port);
	server.on('listening',function() {
		if (server) server.close();
		callback(true);
	});

	server.on('error',function(err) {
		var result = true;
		if (err.code === 'EADDRINUSE') result = false;
		callback(result);
	});
}
