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

var Node_watch = require('node-watch');

//exports
var widget = module.exports;

var downloadDir = 'share/jdfwidget';
var publishDir = downloadDir+'/widget';

/**
 * @widget path check
 */
widget.pathCheck = function(name){
	if (typeof(name) == 'undefined' )  return true;

	if ( !/^widget\//.test(name) ) {
		console.log('jdf error widget name format error');
		return true;
	}

	if (! f.exists(name)) {
		console.log('jdf error widget path is not exists');
		return true;
	}

	return false;
}

/**
* @本地预览页面templete
* @todo: 放在server上控制
*/
widget.templete = function(str, title){
	if (typeof(str) == 'undefined' || !str) {
		var str = '';
	}

	return '<!DOCTYPE html>'+'\r\n'+
		'<html>'+'\r\n'+
		'<head>'+'\r\n'+
		'<meta charset="utf-8" />'+'\r\n'+
		'<title>'+title+'</title>'+'\r\n'+
		'<link rel="stylesheet" type="text/css" href="http://misc.360buyimg.com/lib/skin/2013/base.css" media="all" />'+'\r\n'+
		'<script type="text/javascript" src="http://misc.360buyimg.com/jdf/lib/jquery-1.6.4.js"></script>'+'\r\n'+
		'<script type="text/javascript" src="http://misc.360buyimg.com/jdf/1.0.0/unit/base/1.0.0/base.js"></script>'+'\r\n'+
		'</head>'+'\r\n'+
		'<body>'+'\r\n'+str+'\r\n'+
		'</body>'+'\r\n'+
		'</html>'
	;
}

/**
 * @path has "widget" 
 */
widget.hasWidget = function(path){
	 var reg = new RegExp(jdf.config.widgetDir,'gm');
	 return reg.test(path);
}

/**
* @预览所有widget
* @example  jdf widget -all
* @本地所有的widget中tpl,css,js拼装后html文件放在html中
*/
widget.all = function(){
	jdf.bgMkdir();

	var htmlDir = jdf.config.htmlDir;
	f.mkdir(htmlDir);
	
	var target = htmlDir+'/allwidget.html';
	
	var widgetDir = f.currentDir()+'/'+jdf.config.widgetDir;
	if (!f.exists(widgetDir)) {
		console.log('jdf error widget not exists');
		return;
	}

	var core = function(){
		var widgetListHtml = '';
		fs.readdirSync(widgetDir).forEach(function(item){
			if (f.excludeFiles(item)) {
				widgetListHtml += '{%widget name="'+item+'"%}\r\n';
			}
		});
		
		var result = widget.templete( '\r\n'+widgetListHtml, jdf.getProjectPath()+' - all widget preview' );
		f.write( target, result);
	}
	
	core();
	jdf.argvInit('build', '-open', function(){
		//todo watch
		//core();
	});

	Openurl.open('http://localhost:3000/'+target);
	console.log('jdf open you broswer to see it');
}

/**
* @本地预览widget
* @example  jdf widget -preview widget/header
* @本地widget中tpl,css,js拼装后html文件放在当前widget中
*/
widget.preview = function(name){
	jdf.bgMkdir();
	
	if (widget.pathCheck(name)) {
		return;
	}
	
	var target = name;
	var widgetname = name.replace(/^widget\//, '');

	var core = function (){
		var result = widget.templete(null, widgetname);
		fs.readdirSync(target).forEach(function(item){
			if ( item && f.excludeFiles(item) ){
				var itemContent = f.read(target+'/'+item);
				
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
			}
		});

		var indexUrl = target+'/'+widgetname+'.html';
		f.write(indexUrl, result);
	}

	core();
	Server.init(target+'/', jdf.config.localServerPort);
	Openurl.open('http://localhost:3000/'+widgetname+'.html');
	console.log('jdf open you broswer to see it');

	//监听
	Node_watch(target, function(widgetname) {
		core();
	});
}

/**
* @下载widget到当前项目文件夹
* @example  jdf widget -install widget/name
* @time 2014-3-14 14:50:29
*/
widget.install = function(name){
	var source = downloadDir+'/'+name;
	var target = f.currentDir()+'/'+name;
	
	var widgetname = name.replace(/^widget\//, '');

	if (f.exists(target)) {
		console.log('jdf warnning widget "'+widgetname+'" is exists');
		return;
	}

	var ftp = require('./ftp.js');
	ftp.download(source, target, function(data){
		if (data == 'error') {
			console.log('jdf warnning widget "'+widgetname+'" is not exists on server');
		}else{
			console.log('jdf widget "'+widgetname+'" install done!');
		}
	})
}

/**
* @发布widget至server
* @time 2014-3-14 14:50:29
* @example  jdf widget -publish widget/name
* @todo 增加name验证和版本控制
*/
widget.publish = function(name){	
	if (widget.pathCheck(name)) {
		return;
	}

	var ftp = require('./ftp.js');
	ftp.mkdir(publishDir);

	var widgetname = name.replace(/^widget\//, '');
	var param = [0, 0, 0, '-custom', name, publishDir+'/'+widgetname];
	jdf.upload(param, false, function(){
		 console.log('jdf widget "'+widgetname+'" publish done!');
	});
}

/**
* @取得所有widget的列表
* @time 2014-3-14 14:50:29
*/
widget.list = function(name){
	ftp.list(publishDir, function(data){
		console.log(data);
	})
}

/**
* @根据关键字搜索所有widget
* @time 2014-3-14 14:50:29
*/
widget.search = function(name){
	 
}
