/**
* @simple server
*/
var PORT = 3000;
var http = require('http');
var url=require('url');
var fs=require('fs');
var path=require('path');

var mine = {
  "css": "text/css",
  "gif": "image/gif",
  "html": "text/html",
  "tpl": "text/html",
  "ico": "image/x-icon",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "js": "text/javascript",
  "json": "application/json",
  "pdf": "application/pdf",
  "png": "image/png",
  "svg": "image/svg+xml",
  "swf": "application/x-shockwave-flash",
  "tiff": "image/tiff",
  "txt": "text/plain",
  "wav": "audio/x-wav",
  "wma": "audio/x-ms-wma",
  "wmv": "video/x-ms-wmv",
  "xml": "text/xml"
};

//exports
var server = module.exports = {};

/**
* @init
*/
server.init = function(serverCurrentDir, port){
	var faviconPath = __dirname+'/favicon.icon';

	var writeFavicon = function (response){
		 fs.exists(faviconPath, function (exists){
		 	 if ( exists ){
		 	 	response.writeHead(200, {'Content-Type': mine['icon']});
		 	 	console.log(fs.readFileSync(faviconPath));
		 	 	response.write(fs.readFileSync(faviconPath), 'favicon');
		 	 }
		 })
	}

	if (typeof(port) != 'undefined') {
		PORT = port;
	}

	var config = http.createServer(function (request, response) {
		var pathname = url.parse(request.url).pathname;
		if (typeof(serverCurrentDir) == 'undefined') {
			var realPath = fs.realpathSync('.') +'/'+ pathname;
		}else {
			var realPath = serverCurrentDir +'/'+ pathname;
		}
		realPath = decodeURI(realPath);

		var ext = path.extname(realPath);
		ext = ext ? ext.slice(1) : 'unknown';

		fs.exists(realPath, function (exists) {
			//writeFavicon(response);

			if (!exists) {
				response.writeHead(404, {
					'Content-Type': 'text/plain'
				});
				response.write("This request URL " + pathname + " was not found on this server.");
				response.end();
			} else {
				fs.readFile(realPath, "binary", function (err, file) {
					if (err) {
						if(err.errno == 28){
							response.writeHead(200, {
								'Content-Type': mine.html
							});
							var html = server.getDirList(realPath, pathname);
							response.write(html);
							response.end();
						}else{
							response.writeHead(500, {
								'Content-Type': mine.html
							});
							response.end(err);
						}
					} else {
						var contentType = mine[ext] || "text/plain";
						response.writeHead(200, {
							'Content-Type': contentType
						});
						response.write(file, "binary");
						response.end();
					}
				});
			}
		});
	});
	config.listen(PORT);
}

/**
* @get dir list
*/
server.getDirList = function(realPath, pathname){
	var dirname = '/';
	var copyright = '<p><strong style="font-size:1.2em">jdf server </strong><span style="font-size:0.8em">'+new Date()+'</span></p>';
	var html = '<li style="padding-bottom:5px;"><a href="../">../</a></li>';
	realPath = path.normalize(realPath);
	pathname += '/';
	pathname = pathname.replace(/\/\//,'');

	fs.readdirSync(realPath).forEach(function(name){
		if( !/.Ds_Store$/.test(name) ){
			var url = pathname +'/'+name;
			url = url.replace(/\/\//g,'/');
			url = encodeURI(url);
			dirname = path.dirname(url);
			
			html += '<li style="padding-bottom:0.2em;"><a href="'+url+'">'+name+'</a></li>';
		}
	})

	html = '<ul>' +html+ '</ul>';
	html = '<h1>Index of '+dirname+'</h1><hr/>'+html+'<hr/> '+copyright;
	return html;
}
