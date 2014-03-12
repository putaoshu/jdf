/**
* @本地widget预览和发布至外端机器
*/
var path = require('path');
var fs = require('fs');

//依赖lib
var $ = require('./base.js');
var f = require('./file.js');
var jdf = require('./jdf.js');
var Server = require('./server.js');
var Openurl = require("./openurl.js");

//exports
var widget = module.exports;

widget.templete = function(str){
	if (typeof(str) == 'undefined' ) {
		var str = '';
	}

	return '<!DOCTYPE html>'+'\r\n'+
		'<html>'+'\r\n'+
		'<head>'+'\r\n'+
		'<meta charset="utf-8" />'+'\r\n'+
		'<title></title>'+'\r\n'+
		'<script type="text/javascript" src="http://misc.360buyimg.com/lib/js/e/jquery-1.6.4-min.js"></script>'+'\r\n'+
		'<script type="text/javascript" src="http://misc.360buyimg.com/product/index/js/base/base.js"></script>'+'\r\n'+
		'</head>'+'\r\n'+
		'<body>'+'\r\n'+str+'\r\n'+
		'</body>'+'\r\n'+
		'</html>'
	;
}

widget.init = function(){
	jdf.bgMkdir();
	widget.preview('jdj_accordion');
}

/**
* @本地预览widget
*/
widget.preview = function(filename){
	var result = widget.templete();
	var hasTpl = false;
	var dir = jdf.jdjDir +'/widget'+'/'+filename;
	
	if (!f.exists(dir)) {
		console.log('jdf error [widget.preview] "'+filename+' widget" is not exists');
		return;
	}

	fs.readdirSync(dir).forEach(function(item){
		if(!item) return;
		var itemContent = f.read(dir+'/'+item);
		
		if ($.is.tpl(item)) {
			hasTpl = true;
			itemContent = itemContent ;
			result = $.placeholder.insertBody(result, itemContent);
		}

		if ($.is.css(item)) {
			result = $.placeholder.insertHead(result, $.placeholder.cssLink(item) );
		}
		
		if ($.is.js(item)) {
			result = $.placeholder.insertHead(result, $.placeholder.jsLink(item) );			
		}
	});
	
	if (result != widget.templete() && hasTpl) {
		var indexUrl = dir+'/'+filename+'.html';
		f.write(indexUrl, result);
		Server.init(dir+'/');
		Openurl.open('http://localhost:3000/'+filename+'.html');
		console.log('jdf: open you broswer to see it');
	}else {
		console.log('jdf error [widget.preview] "'+filename+'.tpl" is not exists');
	}
}

widget.init();