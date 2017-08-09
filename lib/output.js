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
var CssSprite = require('./cssSprite.js');
var Concat = require('./concat.js');
var CompressScheduler = require('./compressScheduler.js');

//exports
var output = module.exports = {};

/**
 * @init
 */
output.init = function(options){
	// console.log(options);
	
	if(jdf.config.build.hasCmdLog) console.log('jdf output ...');	
	
	var type = options.type,
		list = options.list,
		isbackup = options.isbackup,
		isdebug = options.isdebug,
		callback = options.callback;

	var outputdirName = jdf.config.outputDirName;
	var outputComment = jdf.config.output.comment;
	var encoding = jdf.config.output.encoding;
	var excludeFiles = jdf.config.output.excludeFiles;
		excludeFiles = excludeFiles ? excludeFiles + '|.vm|.scss|.less|.psd' : '.vm|.scss|.less|.psd';

	var weinre = jdf.config.build.weinre;
	var outputdir = outputdirName+'/'+ (options.projectPath || jdf.getProjectPath());
	var isbackup = typeof(isbackup) == 'undefined' ? false : isbackup;
	
	//[notice]输出路径暂不可配置
	var cssDir = path.normalize( jdf.bgCurrentDir + '/' + jdf.config.cssDir );
	var imagesDir = path.normalize( jdf.bgCurrentDir + '/' + jdf.config.imagesDir );
	var jsDir =  path.normalize( jdf.bgCurrentDir + '/' + jdf.config.jsDir );
	var htmlDir = path.normalize( jdf.bgCurrentDir + '/' + jdf.config.htmlDir );
	var widgetDir = path.normalize( jdf.bgCurrentDir + '/' + jdf.config.widgetDir );

  // zip打包output文件夹相关路径
  var sourcePath = jdf.currentDir + '/' + outputdir;
  var zipPath = jdf.currentDir;
  var splitPathArr = outputdir && outputdir.split('/');
  var zipName = splitPathArr && splitPathArr[splitPathArr.length -1] + '.zip';

	var debugHtml = '';
	if(weinre){
		fs.readdirSync(htmlDir).forEach(function(name){
			var pathname = path.join(htmlDir, name);
			if(f.isFile(pathname)){
				debugHtml += '<li style="padding-bottom:0.2em;"><a target="_blank" href="'+mobileWeinre(pathname)+'">'+name+'</a></li>';
			}
		});

		debugHtml = '<ul>'+debugHtml+'</ul>';

		f.write(path.join(htmlDir, '_debug.html'), debugHtml);
	}

	var core = function() {
		var logText = 'jdf output success!';
		var copyDefaultDir = function(){
			//jdf.config.baseDir是一期目录规划的问题
			var cssOutputDir = outputdir + '/' + jdf.config.cssDir.replace(jdf.config.baseDir+'/', '');
			var imagesOutputDir = outputdir + '/' + jdf.config.imagesDir;
			if(jdf.config.baseDir != ''){
				imagesOutputDir = outputdir + '/' + jdf.config.imagesDir.replace(jdf.config.baseDir+'/', '');
			}
			var jsOutputDir = outputdir + '/' + jdf.config.jsDir.replace(jdf.config.baseDir+'/', '');

			//图片目录不位于css/i中
			if(jdf.config.imagesDir.split(jdf.config.cssDir).length  == 1 ){
				f.copy(imagesDir, imagesOutputDir);
			}
			
			f.copy(cssDir, cssOutputDir, '(css|'+$.imageFileType()+')$', (excludeFiles ? excludeFiles : '(less|scss)$'), null, null, null, encoding);
			
			if(!jdf.config.build.es6Entry){
				f.copy(jsDir, jsOutputDir, (isdebug ? '(js|map)$' : 'js$'), (excludeFiles ? excludeFiles : 'babel$'), null, null, null, encoding);
			}

			f.copy(htmlDir, outputdir+'/'+ (
				jdf.config.outputHtmlDir == null 
				? jdf.config.htmlDir 
				: jdf.config.outputHtmlDir
			), null, excludeFiles, null, null, null, encoding);

			// 输出widget todo 可配置
			var outputWidgetDir = outputdir+'/'+jdf.config.widgetDir;
			f.copy(widgetDir, outputWidgetDir,  '(js|css|'+$.imageFileType()+(isdebug ? '|map' : '') + ')$', (excludeFiles ? excludeFiles : '(less|scss|psd)$'), null, null, null, encoding);
			
			if(f.exists(widgetDir)){
				
				//将所有widget/images复制到html/images
				fs.readdirSync(widgetDir).forEach(function(dir){
					var source = widgetDir + '/' + dir;
					if(f.isDir(source) && f.exists(source + '/images') ){
						f.mkdir(jdf.config.htmlDir+'/images');
						f.copy(source + '/images', outputdir + '/' + jdf.config.htmlDir+ '/images', null, null, null, null, null, encoding);
					};
				});

				//复制到widget的目标目录之后，再将空目录删除
				fs.readdirSync(outputWidgetDir).forEach(function(dir){
					var realpath = fs.realpathSync(outputWidgetDir + '/' + dir);
					var dirs = fs.readdirSync(realpath);
					var files = f.getdirlist(realpath);

					if(files.length == 0 && dirs.length == 0){
						fs.rmdirSync(realpath);
					}
				});

				//combineWidgetCss下widget中的图片widgert/a/i/a.png输出至css/i/目录下
				if (jdf.config.output.combineWidgetCss){
					f.mkdir(imagesOutputDir);
					var imgList = f.getdirlist(widgetDir, $.imageFileType()+'$');
					imgList.forEach(function(imgListItem){
						f.copy(imgListItem, imagesOutputDir+'/'+ path.basename(imgListItem), null, null, null, null, null, encoding);
					});
				}
			}
		}

		var customItemRes='';
		var customTag= true;

		switch (type){
			case 'default' :
				copyDefaultDir();
				break ;
			case 'prod':
				copyDefaultDir();
				break;
			case 'pub':
				copyDefaultDir();
				break;	
			case 'plain':
				copyDefaultDir();
				customTag = false;
				break;
			// case 'hashtml': 
			// 	copyDefaultDir();

			// 	f.copy(htmlDir, outputdir+'/html', null, excludeFiles, null, null, null, encoding);
			// 	break;
			case 'custom':
				if(!list) return;
				var listArray = list.split(',');
				for (var i=0; i<listArray.length; i++ ){
					var item = listArray[i];
					if ( f.exists(item) ) {
						var dirname = path.dirname(item);
						var basename = path.basename(item);
						if($.is.less(basename) || $.is.sass(basename)){
							basename = basename.replace(/(sass|scss|less)/g, 'css');
						}

						var source = path.normalize( jdf.bgCurrentDir + '/'+ dirname  +'/'+ basename );
						
						if (isbackup){ 
							backupProject(item, encoding);
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
							//jdf u widget/xxx/时要过滤某些文件
							f.copy(source, target, null, (excludeFiles ? excludeFiles : '(vm|tpl|less|scss|psd)$'), null, null, null, encoding);
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
			backupProject(undefined, encoding);
		}

        if(customTag){
            Q().then(function (){
				//css sprite
				if(!isbackup){
					if(jdf.config.output.cssSprite){
						CssSprite.init(outputdirName);
					}
				}
			}).then(function (){
				//压缩 1.0
				/*	
				if(!isbackup){
					var Compress = require('./compress.js');
					Compress.init(outputdirName, isdebug);		
				}*/
				if(jdf.config.build.hasCmdLog) console.log('jdf compress ...');
				CompressScheduler.init(outputdirName, isdebug, function(){
					Q().then(function (){
	                    //合并
	                    if(!isbackup){
	                        Concat.init(outputdirName);
	                    }
	                }).then(function (){
	                    //callback
	                    if(callback) callback();
	                }).then(function (){
	                    //log
	                    if(!isbackup){
	                        console.log(logText);

                          if (jdf.config.output.zipOutput) {
                            f.zip(sourcePath, zipPath, zipName);
                          }
	                    }
	                });
				});
			})
        }else{
        	console.log(logText);

          if (jdf.config.output.zipOutput) {
            f.zip(sourcePath, zipPath, zipName);
          }
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
 * @mobileWeinre
 * @在页面的body标签最后插入一个<script src="http://123.56.105.44:8080/target/target-script-min.js#20150810145518"></script>
 */
function mobileWeinre(pathname){
	var timestamp = $.getTimestamp();
	var weinreUrl = jdf.config.build.weinreUrl + '/target/target-script-min.js#' + timestamp;
	var content = f.read(pathname);

	content = $.placeholder.insertBody(content, '<script src="' + weinreUrl + '"></script>');
	f.write(pathname, content);

	return jdf.config.build.weinreUrl + '/client#' + timestamp;
}

/**
* @备份工程文件至 "tags/日期" 文件夹
* @time 2014-3-18 15:20:43
*/
function backupProject(dirname, encoding){
    var tagsDirName = 'tags/'+ $.getDay()+'/';
	var tagsDir = jdf.getProjectParentPath(jdf.currentDir) +'/' +tagsDirName;
	var logMsg = '';

	//backup all
	if (typeof(dirname) == 'undefined') {
		f.copy(jdf.currentDir +'/'+ jdf.config.cssDir, tagsDir  + jdf.config.cssDir, null, null, null, null, null, encoding);
		f.copy(jdf.currentDir +'/'+ jdf.config.jsDir, tagsDir +  jdf.config.jsDir, null, null, null, null, null, encoding);
		f.copy(jdf.currentDir +'/'+ jdf.config.widgetDir, tagsDir + jdf.config.widgetDir, null, null, null, null, null, encoding);
		logMsg = jdf.config.cssDir +','+jdf.config.jsDir +','+jdf.config.widgetDir;
	}else {
	//custom backup
		f.copy(jdf.currentDir +'/'+ dirname, tagsDir + dirname, null, null, null, null, null, encoding);
		logMsg = dirname;
	}
	console.log('jdf backup ['+logMsg+'] to "'+ tagsDirName + '" done! ');
}
