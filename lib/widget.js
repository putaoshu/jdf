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
var FindPort = require('./findPort');

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

	/*
	if ( !/^widget\//.test(name) ) {
		console.log('jdf error widget name format error');
		return true;
	}*/

	if (! f.exists('widget/'+name)) {
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

	var css = '';
	jdf.config.widget.css.forEach(function(item){
		css += '<link rel="stylesheet" type="text/css" href="'+item+'" media="all" />\r\n';
	})

	var js = '';
	jdf.config.widget.js.forEach(function(item){
		js += '<script type="text/javascript" src="'+item+'"></script>\r\n';
	})

	return '<!DOCTYPE html>'+'\r\n'+
		'<html>'+'\r\n'+
		'<head>'+'\r\n'+
		'<meta charset="utf-8" />'+'\r\n'+
		'<title>'+title+'</title>'+'\r\n'+css+js+
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
		Openurl.open('http://localhost:'+jdf.config.localServerPort+'/'+target);
		console.log('jdf open you broswer to see it');
	});
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
	
	var target = 'widget/'+name;
	var widgetname = name;

	var core = function (){
		var result = widget.templete(null, widgetname);
		fs.readdirSync(target).forEach(function(item){
			if ( item && f.excludeFiles(item) ){
				var itemContent = f.read(target+'/'+item);

				if ($.is.tpl(item) || $.is.vm(item)) {
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

	var localServerPort = jdf.config.localServerPort;
	FindPort(localServerPort,function(data){
		if (!data) {
			console.log('Port ' + localServerPort + ' is tack up');
			localServerPort += 1000;
			jdf.config.localServerPort = localServerPort;
		}

		Server.init(target+'/', jdf.config.localServerPort);
		Openurl.open('http://localhost:'+jdf.config.localServerPort+'/'+widgetname+'.html');
		console.log('jdf open you broswer to see it');

		//监听
		Node_watch(target, function(widgetname) {
			core();
		});
	});
}

/**
* @下载widget到当前项目文件夹
* @example  jdf widget -install widget/name
* @time 2014-3-14 14:50:29
*/
widget.install = function(name){
	var source = downloadDir+'/widget/'+name;
	var target = f.currentDir()+'/widget/'+name;
	
	var widgetname = name;

	if (f.exists(target)) {
		console.log('jdf warnning widget "'+widgetname+'" is exists in current project');
		return;
	}

	var ftp = require('./ftp.js');
	ftp.download(source, target, function(data){
		if (data == 'error') {
			console.log('jdf warnning widget "'+widgetname+'" is not exists on server '+jdf.config.host);
		}else{
			console.log('jdf widget "'+widgetname+'" install done from server '+jdf.config.host);
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

	var widgetname = name;
	var param = [0, 0, 0, '-custom', 'widget/'+name, publishDir+'/'+widgetname];
	jdf.upload(param, false, function(){
		console.log('jdf widget "'+widgetname+'" publish done!');
	});
}

/**
* @取得所有widget的列表
* @time 2014-6-23 11:04:00
*/
widget.list = function(){
	var ftp = require('./ftp.js');
	ftp.list(publishDir, function(data){
		if(data){
			console.log('jdf widget list: ');
			console.log('----------------');
			data.forEach(function(item){
				console.log(item.name);
			})
		}
	})
}

/**
* @根据关键字搜索所有widget
* @time 2014-3-14 14:50:29
*/
widget.search = function(name){
	 
}


/**
* @widget自动生成目录
* @time 2014-6-23 11:04:00
*/
widget.create = function(name){
	var widgetDir = 'widget/'+name;
	if(f.exists(widgetDir)){
		console.log('jdf warnning : widget "'+name+'" is exists');
	}else{
		f.mkdir(widgetDir);
		jdf.config.widget.createFiles.forEach(function(item){
			f.write(widgetDir+'/'+name+'.'+item, '');	 
		});
		console.log('jdf widget "'+name+'" create done');
	}
}
