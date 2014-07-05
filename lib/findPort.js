/**
 * @find Port
 */
var net = require('net');
module.exports = function (port, callback) {
	var server = net.createServer().listen(port);
	server.on('listening',function() {
		if (server) server.close();
		callback(true, port);
	});

	server.on('error',function(err) {
		var result = true;
		if (err.code === 'EADDRINUSE' || err.code === 'EACCES') result = false;
		callback(result, port);
	});
}
