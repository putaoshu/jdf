/**
* @输出处理后的工程文件
* @param {String} options.type 'default' : 默认输出js,css文件夹 如$ jdf o
* @param {String} options.type 'hashtml' : hashtml下输出js,css和html文件夹 如$ jdf o -html
* @param {String} options.type 'custom' : 自定义输出 如$ jdf o app/js/test.js
* @param {String} options.list : 自定义输出的文件路径,如app/js/test.js
* @param {Boolse} options.isbackup 是否备份
* @param {Boolse} options.isdebug 是否为debug
* @param {Function} options.callback 回调函数
* @todo 只复制改动的文件
*/
var path = require('path');
var fs = require('fs');
var Q = require("q");


//lib自身组件
var $ = require('./base.js');
var f = require('./file.js');
var jdf = require('./jdf.js');
var Compress = require('./compress.js');
var CssSprite = require('./cssSprite.js');

//exports
var output = module.exports = {};

/**
 * @init
 */
output.init = function(options){
	var type = options.type,
		list = null || options.list,
		isbackup = false || options.isbackup,
		isdebug = false || options.isdebug,
		callback = null || options.callback;

	var outputdirName = jdf.config.outputDirName;
	var outputdir = outputdirName+'/'+jdf.getProjectPath();
	var isbackup = typeof(isbackup) == 'undefined' ? false : isbackup;
	
	//[notice]输出路径暂不可配置
	var cssDir = path.normalize( jdf.bgCurrentDir + '/' + jdf.config.cssDir );
	var imagesDir = path.normalize( jdf.bgCurrentDir + '/' + jdf.config.imagesDir );
	var jsDir =  path.normalize( jdf.bgCurrentDir + '/' + jdf.config.jsDir );
	var htmlDir = path.normalize( jdf.bgCurrentDir + '/' + jdf.config.htmlDir );
	var widgetDir = path.normalize( jdf.bgCurrentDir + '/' + jdf.config.widgetDir );

	/*
	if (!f.exists(jdf.config.cssDir) && !f.exists(jdf.config.jsDir) && !f.exists(jdf.config.htmlDir)) {
		console.log('jdf tips : type "jdf init" for usage.');
		return;
	}*/
	
	var core = function(){
		var logText = 'jdf output success!';
		var copyDefaultDir = function(){
			//jdf.config.baseDir是一期目录规划的问题
			var cssOutputDir = outputdir + '/' + jdf.config.cssDir.replace(jdf.config.baseDir+'/', '');
			var imagesOutputDir = outputdir + '/' + jdf.config.imagesDir;
			if(jdf.config.baseDir != ''){
				imagesOutputDir = outputdir + '/' + jdf.config.imagesDir.replace(jdf.config.baseDir+'/', '');
			}
			var jsOutputDir = outputdir + '/' + jdf.config.jsDir.replace(jdf.config.baseDir+'/', '');

			f.copy(cssDir, cssOutputDir, null, '(less|scss)$');
			f.copy(jsDir, jsOutputDir);

			// 输出widget todo 可配置
			f.copy(widgetDir, outputdir+'/'+jdf.config.widgetDir,  '(js|css|'+$.imageFileType()+')$', '(less|scss)$');
			
			//widget中的图片widgert/a/i/a.png输出至css/i/目录下
			f.mkdir(imagesOutputDir);
			var imgList = f.getdirlist(widgetDir, $.imageFileType()+'$');
			imgList.forEach(function(imgListItem){
				f.copy(imgListItem, imagesOutputDir+'/'+ path.basename(imgListItem) );
			});
		}

		var customItemRes='';
		var customTag= true;

		switch (type){
			case 'default' :
				copyDefaultDir();
				break ;
			case 'hashtml':
				copyDefaultDir();
				f.copy(htmlDir, outputdir+'/html');
				break;
			case 'custom':
				if(!list) return;
				var listArray = list.split(',');
				for (var i=0  ; i<listArray.length  ; i++ ){
					var item = listArray[i];
					
					if ( f.exists(item) ) {
						var dirname = path.dirname(item);
						var basename = path.basename(item);
						var source = path.normalize( jdf.bgCurrentDir + '/'+ dirname  +'/'+ basename );
						
						if (isbackup){ 
							backupProject(item);
						}else {
							var dirnameTemp = '';
							if (dirname != '.') {
								dirnameTemp = dirname.replace(jdf.config.baseDir,'');
								dirnameTemp = '/' + dirnameTemp;
							}
							var targetBase = outputdir + dirnameTemp;
							var target = path.normalize(targetBase +'/'+ basename );
							var targetdir = path.normalize(targetBase);
							
							f.mkdir(targetdir);
							f.copy(source, target);
							customItemRes+=item+',';
						}
					}
				}

				if (customItemRes == ''){
					customTag = false;
					console.log('jdf error ['+list+'] is not exists');
				}

				if (!isbackup) { logText = 'jdf output ['+customItemRes+'] done!';}
				break;
		}
	
		//backup jsdir, cssdir, widgetdir to tags dir
		if (type == 'backup') {
			backupProject();
		}	

		if(customTag){
			Q().then(function (){
				//css sprite
				if(!isbackup){
					if(jdf.config.output.cssSprite && !isdebug){
						CssSprite.init(outputdirName);
					}
				}
			}).then(function (){
				//压缩
				if(!isbackup){
					Compress.init(outputdirName, isdebug);
				}
			}).then(function (){
				//callback
				if(callback) callback();
			}).then(function (){
				//log
				if(!isbackup){
					console.log(logText);
				}
			});
		}
	}
	
	if (f.exists(outputdirName)) {
		f.del(outputdirName,function(){
			core();
		});
	}else {
		core();
	}
}

/**
* @备份工程文件至 "tags/日期" 文件夹
* @time 2014-3-18 15:20:43
*/
function backupProject(dirname){
	if (/branches|trunk/.test(jdf.currentDir) ) {
		var tagsDirName = 'tags/'+ $.getDay()+'/';
		var tagsDir = jdf.getProjectParentPath(jdf.currentDir) +'/' +tagsDirName;
		var logMsg = '';
	
		//backup all
		if (typeof(dirname) == 'undefined') {
			f.copy(jdf.currentDir +'/'+ jdf.config.cssDir, tagsDir  + jdf.config.cssDir );
			f.copy(jdf.currentDir +'/'+ jdf.config.jsDir, tagsDir +  jdf.config.jsDir );
			f.copy(jdf.currentDir +'/'+ jdf.config.widgetDir, tagsDir + jdf.config.widgetDir );
			logMsg = jdf.config.cssDir +','+jdf.config.jsDir +','+jdf.config.widgetDir;
		}else {
		//custom backup
			f.copy(jdf.currentDir +'/'+ dirname, tagsDir + dirname );
			logMsg = dirname;
		}
		console.log('jdf backup ['+logMsg+'] to "'+ tagsDirName + '" done! ');
	}
}