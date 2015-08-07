/**
 * @livereload
 * @refer http://feedback.livereload.com/knowledgebase/articles/86174-livereload-protocol
 * @refer https://www.npmjs.org/package/node-livereload
 */
var livereloadPath = "" + __dirname + "/../lib/";

var http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');

var WSServer = require('jdf-ws').Server;

var Server={};
module.exports = Server;

/**
 * @init
 */
Server.init = function(options) {
	var key, opts, value;
	if ( typeof(options) == 'undefined' ) {
		var options = {};
	}
	opts = {
		apiVersion: '1.6',
		//host: '0.0.0.0',
		port: '35729'// 不能变
	};

	for (key in opts) {
		value = opts[key];
		if (options[key]) {
			opts[key] = options[value];
		}
	}

	this.conns = [];
	this.web = null;
	this.options = opts;

	console.log("LiveReload is waiting for a browser to connect");
	var connectTag = true;
	this.start(function(){
		if (connectTag) {
			console.log('Browser connected LiveReload');
		}
		connectTag = false;
	});
};

Server.reloadBrowser = function(paths) {
	var conn, data, _i, _len, _results;
	if (paths == null) {
		paths = [];
	}
	//console.log("Reloading browser: " + (paths.join(' ')));
	_results = [];
	for (_i = 0, _len = paths.length; _i < _len; _i++) {
		path = paths[_i];
		data = {
			command: 'reload',
			path: path,
			liveCSS: true,
			liveImg: true
		};
		_results.push((function() {
			var _j, _len1, _ref, _results1;
			_ref = this.conns;
			_results1 = [];
			for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
				conn = _ref[_j];
				_results1.push(conn.send(JSON.stringify(data)));
			}
			return _results1;
		}).call(this));
	}
	return _results;
};

Server.stop = function() {
	return this.web.close(function() {
		if (this.web) {
			return console.log('Shutdown the server.');
		}
	});
};

Server.start = function(callback) {
	var conns, web, wss;
	//console.log("LiveReload " + this.options.apiVersion + " is waiting for a browser to connect.");
	conns = this.conns;

	web = http.createServer(function(request, response) {
		var body, exists, existsFuc, file, query, read;
		query = url.parse(request.url, true);
		existsFuc = fs.existsSync ? fs.existsSync: path.existsSync;
		file = "" + livereloadPath + query.pathname;
		exists = existsFuc(file);
		if (exists && query.pathname !== '/') {
			response.writeHead(200, {
				'Transfer-Encoding': 'chunked',
				'Content-Type': 'application/x-javascript'
			});
			read = fs.createReadStream(file);
			return read.pipe(response);
		} else {
			body = 'Not Found';
			response.writeHead(404, {
				'Content-Length': body.length,
				'Content-Type': 'text/plain'
			});
			return response.end(body);
		}
	});

	web.listen(this.options.port, this.options.host);
	this.web = web;

	wss = new WSServer({
		server: web,
		path: '/livereload'
	});
	
	wss.on('connection',function(ws) {
		if(callback) callback();
		//console.log('Browser connected.');
		conns.push(ws);

		ws.on('message', function(msg, flag) {
			var handshake, protocols;
			msg = JSON.parse(msg);
			if (msg.command === 'hello') {
				protocols = msg.protocols;
				protocols.push('http://livereload.com/protocols/2.x-remote-control');
				protocols.push('http://livereload.com/protocols/official-7');
				handshake = {
					'command': 'hello',
					'protocols': protocols,
					'serverName': 'livereload-node'
				};
				ws.send(JSON.stringify(handshake));
			}
			if (msg.command === 'info' && msg['url']) {
				//return console.log("Browser URL: " + msg.url);
			}
		});
		
		ws.on('close',function() {
			conns.splice(conns.indexOf(ws, 1));
			//return console.log('Browser disconnected.');
		});
	});
};