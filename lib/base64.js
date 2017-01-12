/**
 * @css base64
 * @ctime 2015-8-18
 */
var $ = require('./base.js');
var f = require('./file.js');
var jdf = require('./jdf.js');

var path = require('path');
var base64 = module.exports = {};

base64.init = function(source){
	if(jdf.config.build.hasCmdLog) console.log('compress.base64---'+source);
	var reg_background = /background(?:-image)?:([\s\S]*?)(?:;|$)/gi;
	var reg_img_url = /url\s*\(\s*("(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*'|[^)}]+)\s*\)/i;
	var reg_is_base64 = /[?&]__base64/i;

	var content = f.read(source);
	var background = content.match(reg_background);

	if(background){
		content = escape(content);
		background.forEach(function(item, index){
			var img_url = item.match(reg_img_url);

			if(img_url && img_url[0].match(reg_is_base64)){
				var base64Encode = f.base64Encode(path.join(path.dirname(source), img_url[1].replace('?__base64', '')));
				content = content.replace(new RegExp(escape(img_url[1]), 'gi'), ('data:image/png;base64,'+base64Encode));
			}
		});
	}

	return unescape(content);
}