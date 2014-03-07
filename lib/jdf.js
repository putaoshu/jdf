/**
* @jdf
*/
var path = require('path');
var fs = require('fs');
var util = require('util');

//lib自身组件
var $ = require('./base.js');
var f = require('./file.js');
var Server = require('./server.js');
//var cssPraser = require('./cssPraser.js');


//外部组件
var Node_watch = require('node-watch');
var UglifyJS = require("uglify-js");
var CleanCSS = require('clean-css');

var Sass = require('node-sass');
var Less = require('less');

//define
var jdf = module.exports;

/**
* @配置项
*/
jdf.config = {
	configFileName: 'config.json',//配置文件名称
	
	demo:'http://putaoshublog.sinaapp.com/lab/jdf_module/jdf_demo.tar?1',
	jdj:'http://putaoshublog.sinaapp.com/lab/jdf_module/jdj.tar?1',
	jdm:'http://putaoshublog.sinaapp.com/lab/jdf_module/jdm.tar?1',
	
	cdn:'http://misc.360buyimg.com', //静态cdn域名
	jsPlace:"bottom",//编译后js文件位置

	baseDir:'app',//工程文件夹名称
	cssDir : 'app/css',//css文件夹名称
	imagesDir : 'app/css/i',//images文件夹名称
	jsDir: 'app/js',//js文件夹名称
	htmlDir: 'html',//html文件夹名称
	widgetDir: 'widget',//widget文件夹名称

	buildDirName:'html',//编译的文件夹名称
	outputDirName:'build',//输出文件夹名称

	projectPath: null,//工程目录前缀
	host:null,//远端机器IP
	serverDir: 'misc.360buyimg.com' //上传至远端服务器文件夹名称
}

/**
* @commoder help
*/
jdf.help = function(){
	var content = [];
    content = content.concat([
        '',
        '  Commands:',
        '',
		'    init		project directory init',
        '    b,build		build project',
        '    r,release		release project',
        '    o,output		output project',
        '    o,output   -d	output project ( include html folder) ',
        '    o,output   file	output your own definition file',
        '    u,upload		upload output files to remote sever',
        '    u,upload   -d	upload output project ( include html folder) ',
        '    u,upload   file	upload output your own definition file',
      //'    u   -w	watch upload output files to remote sever',
	  '    i,install		download external module or other files',
		' ',
		'  Extra commands:',
        '',
		'    c,compress		compress js&&css (jdf c input output)',
	 //'    clear		clear cache folder', //todo
	 //'    t			create jdj template(jdf t name)',
        '    -h			get help information',
        '    -v			get the version number',
        '',
		'  Example:',
		'',
		'   jdf init'
    ]);
	console.log(content.join('\n'));
}

/**
* @总的初始化函数 from ../index.js
* @commander
*/
jdf.init = function(argv){
	//读取配置文件
	jdf.getConfig(function(){
	    var first = argv[2];
		jdf.currentDir = f.currentDir();

	    if(argv.length < 3 || first === '-h' ||  first === '--help'){
	        jdf.help();
	    } else if(first === '-v' || first === '--version'){
	        jdf.version();
	    } else if(first[0] === '-'){
	        jdf.help();

		} else if(first === 'init'){
			jdf.projectDirectoryInit();
		} else if(first === 'b'	|| first === 'build'){
			jdf.argvInit('build');	
		} else if(first === 'r'	|| first === 'release'){
			jdf.argvInit('release');
		} else if(first === 'o'	|| first === 'output'){
			jdf.argvInit('output', argv);
		} else if(first === 'i' || first === 'install'){
			jdf.install(argv);
		} else if(first === 'u' || first === 'upload'){
			jdf.upload(argv);
		
		} else if(first === 'c' || first === 'compress'){
			jdf.compressInit(argv[3],argv[4]);
		} else if(first === 't'){
			jdf.jdjTemplate(argv[3]);

	    } else {
			console.log('jdf error [jdf.init] invalid option: '+first+' \rType "jdf -h" for usage.');
	    }
    });
};

/**
* @输入命令的初始化 output, build, release
*/
jdf.argvInit = function(runType, argv, callback){
	if(runType == 'release' || runType == 'build'){
		jdf.bgMkdir();
		jdf.bgCopyDir();
		jdf.buildMain(runType);

		//加sever和watch
		jdf.server();
		jdf.watch(runType);
	}else if (runType == 'output'){
		jdf.bgMkdir();

		//rename
		var dirname = path.dirname(jdf.bgCurrentDir);
		var extname = path.extname(jdf.bgCurrentDir);
		var newname = dirname+'/'+jdf.bgCurrentDirName+$.getDay('')+$.getTime('');
		
		f.del(jdf.bgCurrentDir,function(){
		//fs.rename(jdf.bgCurrentDir, newname,function(err,data){
			f.mkdir(jdf.bgCurrentDir);
			jdf.bgMkdir(runType);
			jdf.bgCopyDir();
			jdf.buildMain(runType,function(){
				//默认
				var outputType = 'default' ,outputList;
				
				//自定义
				if ( typeof(argv[3]) != 'undefined' ){
					outputType = 'custom';
					outputList = argv[3];
				}

				//debug
				if (typeof(argv[3]) != 'undefined' &&  argv[3] == '-d') {
					outputType = 'debug';
					outputList = null;
				}

				jdf.projectOutput(outputType, outputList, callback);
			});
		});
	}

	//jdf.openurl();
}


jdf.version = function(){
	var package = require('../package.json');
	console.log(package.version);
}

/**
* @读取配置文件config.json, 覆盖默认配置
*/
jdf.getConfig = function(callback){
	var res = null;
	var url = f.currentDir()+'/'+jdf.config.configFileName;
	if (f.exists(url)) {
		try{
			var data = f.read(url);
			if (data) {
				data = JSON.parse(data);
				//console.log(data);
				if (typeof(data) == 'object'){
					for (var i in data) {
						jdf.config[i] = data[i];
					};
				}
				res = data;
			}
		}catch(e){
			console.log('jdf error [ftp.getConfig] - setup error' )
		}
	}
	if(callback) callback(res);
}

/**
* @工程后台文件夹生成
*/
jdf.bgMkdir =function(){
	var list = [ 'HOME','LOCALAPPDATA', 'APPDATA'];
	var temp;
	for(var i = 0, len = list.length; i < len; i++){
		if(temp = process.env[list[i]]){
			break;
		}
	}
	if (temp){
		temp = temp || __dirname + '/../';
		temp += '/.jdf-temp/';
		f.mkdir(temp);
		
		//项目缓存文件夹
		var cacheDir  = temp + '/cache/';
		f.mkdir(cacheDir);
		jdf.cacheDir = cacheDir;

		//项目temp文件夹
		var tempDir  = temp + '/temp/';
		f.mkdir(tempDir);
		jdf.tempDir = tempDir;

		var lib  = temp + '/lib/';
		jdf.libDir = lib;
		f.mkdir(lib);

		//todo : 自动从服务器下载最新版的jdj和jdm,现在是需要install手动下载
		var jdj  = lib + '/jdj/';
		jdf.jdjDir = jdj;
		f.mkdir(jdj);
		var jdm  = lib + '/jdm/';
		jdf.jdmDir = jdm;
		f.mkdir(jdm);

		//复制当前项目至temp文件夹(除outputdir)
		//取得当前工程名
		var currentDirName = path.basename(jdf.currentDir);
		jdf.bgCurrentDir = path.normalize(tempDir +'/'+ currentDirName);
		jdf.bgCurrentDirName = currentDirName;
		f.mkdir(jdf.bgCurrentDir);
	}
}

/**
* @复制当前项目至工程后台目录
*/
jdf.bgCopyDir =function(){
	//仅copy app,html,widget文件
	f.copy(jdf.currentDir+'/'+ jdf.config.baseDir, jdf.bgCurrentDir  +'/'+ jdf.config.baseDir);
	f.copy(jdf.currentDir+'/'+ jdf.config.htmlDir, jdf.bgCurrentDir  +'/'+ jdf.config.htmlDir);
	f.copy(jdf.currentDir+'/'+ jdf.config.widgetDir, jdf.bgCurrentDir  +'/'+ jdf.config.widgetDir);
}

/**
* @upload
* @time 2014-2-26 19:17:39
*/
jdf.upload = function(argv){
	var ftpFn = function(){
		var source = path.normalize(f.currentDir()+'/' + jdf.config.outputDirName);
		var target = jdf.config.serverDir;
		
		//上传核心函数
		if(jdf.config.host){
			var ftp = require('./ftp.js');
			ftp.upload(source, target, null, null, false, false, false, function(){
				console.log('jdf upload ['+jdf.config.host+'] success!');
			});
		}else{
			console.log('jdf error [jdf.upload] - server host no setup');
		}
	}
		
	var outputFnOnce = function(){
		argv[3] = '-d';
		jdf.argvInit('output', argv, function(){
			ftpFn();
		});
	}

	var outputFnWatch = function(){
		ftp.quit();
		jdf.buildMain('output');
		jdf.projectOutput('debug', null, function(){
			 ftpFn();
		});
	}

	if (argv[3] == '-w') {
		//监听上传
		outputFnOnce();
		Node_watch(f.currentDir(), function(filename) {
			console.log(filename);
			outputFnWatch();
		});
	}else {
		//默认
		outputFnOnce();
	}
}

/**
* @从服务器端下载文件 todo:检查版本号
*/
jdf.download = function(pathItem, targetDir){
	var dot = setInterval(function(){
		  console.log('.');
	},1000);
	
	var url = jdf.config[pathItem];
	var cacheDir = path.normalize(jdf.cacheDir +'/'+pathItem+'.tar');
	
	f.download(url, cacheDir , function(data){
		if (data == 'ok') {
			f.tar(cacheDir, targetDir, function(){
				console.log('jdf ['+pathItem+'] install done');
				clearInterval(dot);
			});
		}else if (data == 'error') {
			clearInterval(dot);
		}
	}) 
}

/**
* @从服务器端下载jdj jdm
*/
jdf.install = function(argv){
	jdf.bgMkdir();
	console.log('jdf downloading');

	if (typeof(argv[3]) == 'undefined') {
		jdf.download('jdj', jdf.libDir);
		jdf.download('jdm', jdf.libDir);
	}else if(argv[3] == 'demo'){
		jdf.download('demo', jdf.currentDir );
	}
}

/**
* @服务器
*/
jdf.server = function(){
	Server.init(jdf.bgCurrentDir);
	console.log('jdf server running at http://localhost:3000/');
}

/**
* @watch
*/
jdf.watch = function(type){
	Node_watch(jdf.currentDir, function(filename) {
		var target = jdf.bgCurrentDir  +  filename.replace(jdf.currentDir, '');
		f.copy(filename, target);
		//todo 仅复制有变动的文件
		//jdf.bgCopyDir();
		jdf.buildMain(type);
	});
}
	
/**
* @openurl
* @todo : 仅打开一次
*/
jdf.openurl = function(){
	var openurl = require("openurl");
	openurl.open("http://localhost:3000/html/index.html");
}
	
/**
* @自动刷新
* @todo
*/
jdf.refresh = function(){
	
}

/**
* @获取项目前缀名字
* @1. d:\product\index\trunk ===> index/product
* @2. d:\product\index\branches\home ===> index/product
*/
jdf.getProjectPath = function(){
	var currentDir = f.currentDir() ,nowDir='', result='';
	if(jdf.config.projectPath){
		result = jdf.config.projectPath;
	}else{
		if ( /branches/.test(currentDir) ) {
			nowDir = path.resolve(currentDir, '../' , '../' );
		}else if(/trunk/.test(currentDir)){
			nowDir = path.resolve(currentDir, '../');
		}

		if (nowDir) {
			nowDir = nowDir.split(path.sep);
			var nowDirArrayLength = nowDir.length;
			result = nowDir[nowDirArrayLength-2] +'/'+ nowDir[nowDirArrayLength-1];
		}
	}
	return result;	
}

/**
* @url加cdn前缀
* @time 2014-2-23 16:22
*/
jdf.urlAddCdnPrefix = function(j){
	j = jdf.getProjectPath() +	j;
	if (j.charAt(0) == '/' || j.charAt(0) == '\\' ) {
		j = j.replace('\\','');
		j = j.replace('/','');
	}
	
	j = jdf.config.cdn + '/' + j;
	return j;
}

/**
* @静态资源css,js链接替换处理
* @ src="../app/js/common.js" ==>
	src="http://www.img.com/product/index/app/js/common.js"
*/
jdf.staticUrlReg= function (str,regStr){
	var reg = new RegExp(regStr,'gm');
	var regResult =  str.match(reg);
	if (regResult){
		regResult.forEach(function(item){
			var reg = new RegExp(regStr,'gm');
			var i = reg.exec(item);
			if ( i && !$.is.httpLink(i[1]) ){
				//css,js url
				var j = i[1];
				j = j.replace('app','');

				j = j.replace(/\.\.\//g,'');
				j = jdf.urlAddCdnPrefix(j);
				
				var r = new RegExp(i[1],'gm');
				str = str.replace(r,j);
			}
		});
	}
	return str;
}

/**
* @静态资源css,js链接替换处理入口
*/
jdf.staticUrlReplace = function(str){
	str = jdf.staticUrlReg(str,$.reg.cssStr);
	str = jdf.staticUrlReg(str,$.reg.jsStr);
	return str;
}


/**
* @less/sass文件名称转css后缀
* @time 2014-3-5
* @example  a.less ==> a.css; a.sass ==> a.css
*/
jdf.getCssExtname = function(p) {
    return p.replace(/(scss|less)$/g, function(e) {
        return "css"
    })
}

/**
* @build less/sass  to css
* @time 2014-3-5
*/
jdf.buidCss = function(callback){
	var builddir = '/'+jdf.config.cssDir+'/';
	var basedir = jdf.currentDir+builddir;
	
	if(f.exists(basedir)){
		var sassFileNum = 0;
		var sassFileOutputNum = 0;
		fs.readdirSync(basedir).forEach(function(name){
			if( $.is.less(name) || $.is.sass(name) ) {
				var source = path.normalize( basedir+name ) ;
				var sourceContent = f.read(source);
				var target = path.normalize(jdf.bgCurrentDir + builddir + jdf.getCssExtname(name));

				//less
				if($.is.less(name)){
					Less.render(sourceContent, function (e, css) {
						f.write(target , css);
					});
				}
				
				//sass
				if($.is.sass(name)){
					sassFileNum += 1;
					Sass.render({
						//file: source,
					    data: sourceContent,
					    success: function(css){
							sassFileOutputNum += 1;
					        f.write(target, css);
							if(callback && sassFileOutputNum === sassFileNum){
								callback();
							}
					    },
					    error: function(error) {
					        console.log(error);
					    },
					     includePaths: [path.dirname(source)],
					    // outputStyle: 'compressed'
					    outputStyle: 'nested'
					});
				}
			}
		});
	}
}

/**
* @当含有jdj jdm 模块时写放当前文件一次 __ del
*/
var writeJMOnce= false;

/**
* @build widget , sass, less 
*/
jdf.buildMain = function(type,callback){
	var builddir = '/'+jdf.config.buildDirName+'/';
	var basedir = jdf.currentDir+builddir;
	
	//widget build
	if(f.exists(basedir)){
		fs.readdirSync(basedir).forEach(function(name){
			if( /.html$/.test(name) ) {
				var source = basedir+name;
				var target = path.normalize(jdf.bgCurrentDir + builddir + name);

				jdf.buildWidget(source, f.read(source), type, function(data){
					f.write(target , data.tpl);
					/*
					if (writeJMOnce){
						f.write(source , data.origin);
					}
					return 'ok';
					*/
				});
			}
		});
	}

	//build css
	jdf.buidCss(callback);
}

/**
* @build widget 引入其内容和相关css,js文件以及css,js路径替换
* @param inputPath 文件路径
* @param content 文件内容
* @param type 编译类型 build || release
* @example 
	{%widget name="unit"%} ==> 
	<link type="text/css" rel="stylesheet"  href="/widget/base/base.css" source="widget"/>
	<link type="text/css" rel="stylesheet"  href="/app/css/pkg.css" source="widget"/>
*/
jdf.buildWidget = function(inputPath,content,type,callback){
	//css,js路径替换
	if (type == 'output') {
		content = jdf.staticUrlReplace(content);
	}

	var result = content.match($.reg.widget());
	var origin = content;
	var isJM = false;
	var cssFile='' , jsFile='';
	
	//widget
	if (result){
		var filesListObj = {};//去重用
		result.forEach(function(resultItem){
			var widgetArray = $.reg.widget().exec(resultItem);
			var widgetType;
			var widgetTypeArray = $.reg.widgetType().exec(resultItem);
			//jdj jdm 特殊处理
			if (widgetTypeArray) widgetType = widgetTypeArray[1];
			isJM = (widgetType == 'jdj' || widgetType == 'jdm');
			if (isJM){
				writeJMOnce = true;
			}
		
			//{%widget name=" "%}
			var widgetStr = widgetArray[0];
			//widgetStr中的name
			var widgetName = $.trim(widgetArray[1]);
			var widgetDir = '/widget/' +widgetName;
			//widget 目录
			var fileDir = path.normalize(jdf.currentDir + widgetDir);

			//当前工程不存的jdj和jdm模块从服务端文件复制至当前过来
			if (isJM && !f.exists(fileDir)){
				var source = path.normalize(jdf[widgetType+'Dir']+ widgetDir);
				var target = jdf.currentDir + '/widget/' +widgetName;
				f.copy(source,target);
			}

			var placeholder='';
			var dirExists = f.exists(fileDir);
			if (dirExists){
				var files = fs.readdirSync(fileDir);
				files.forEach(function(item){
					//单个文件处
					var fileUrl = path.join(fileDir, item);
					if ($.is.tpl(item)){
						placeholder = f.read(fileUrl);
						fileUrl = f.pathFormat(path.join(widgetDir, item));
						//todo: 仅第一次时替换
						var typeHtml='';
						if (widgetType) typeHtml='['+widgetType+']';
						placeholder = '\r\n<!-- '+typeHtml+' '+fileUrl+' -->\r\n' + placeholder + '\r\n<!--/ '+fileUrl+' -->';
					}

					var staticUrl = ''+widgetDir +'/'+ item;
					
					if ($.is.css(item) && !filesListObj[fileUrl]){
						var cssLink = $.placeholder.cssLink(staticUrl);
						if (type == 'build'){
							content = $.placeholder.insertHead(content,cssLink);
						}else if (type == 'release' || type == 'output'){
							cssFile +=  f.read(fileUrl) + '\n\r';
						}
						
						if (isJM){
							origin = $.placeholder.insertHead(origin,cssLink);
						}
						filesListObj[fileUrl] = 1;
					}

					if ($.is.js(item) && !filesListObj[fileUrl]){
						var jsLink = $.placeholder.jsLink(staticUrl);
						if (type == 'build'){
							content = $.placeholder.insertHead(content,jsLink);
						}else if (type == 'release' || type == 'output'){
							jsFile += f.read(fileUrl) + '\n\r';
						}
						if (isJM){
							origin = $.placeholder.insertHead(origin,jsLink);
						}
						filesListObj[fileUrl] = 1;
					}
				});

				if (isJM){
					origin = origin.replace(widgetStr,placeholder);
				}

				//替换掉{%widget name="base"%} 
				content = content.replace(widgetStr,placeholder);
			}else{
				console.log('jdf warning [jdf.buildWidget] ' +widgetStr +' widget '+ widgetName+ ' does not exist.');
			}
		});
		
		if (type == 'release' || type == 'output'){
			var outputDir = jdf.bgCurrentDir;
			var outputCss = '/' + jdf.config.cssDir+'/pkg.css';
			var outputJs = '/' + jdf.config.jsDir+'/pkg.js';

			if (type == 'output') {
				outputCss = jdf.config.cdn +'/' +  jdf.getProjectPath() + '/css/pkg.css';
				outputJs = jdf.config.cdn +'/' + jdf.getProjectPath() + '/js/pkg.js';
			}

			var cssLink = $.placeholder.cssLink(outputCss);
			
			//css链接加前缀
			content = $.placeholder.insertHead(content, cssLink  );
			//取内容写入pkg文件中
			f.write(path.normalize(outputDir+'/' + jdf.config.cssDir+'/pkg.css') , cssFile);
			
			var jsLink = $.placeholder.jsLink(outputJs) ;
			//js链接加前缀
			content = $.placeholder.insertBody(content, jsLink );
			//取内容写入pkg文件中
			f.write(path.normalize(outputDir+'/' + jdf.config.jsDir+'/pkg.js') , jsFile);
		}
	}
	
	var data = {
		origin:origin,
		tpl:content,
		css:cssFile,
		js:jsFile
	}
	if (callback) callback(data);
}


/**
* @项目工程目录初始化
* @time 2014-2-19 10:21:37
*/
jdf.projectDirectoryInit = function(){
	var dirArray = [];
	dirArray[0] = jdf.config.baseDir;
	dirArray[1] = jdf.config.cssDir;
	dirArray[2] = jdf.config.imagesDir;
	dirArray[3] = jdf.config.jsDir;
	dirArray[4] = jdf.config.htmlDir;
	dirArray[5] = jdf.config.widgetDir;

	var fileArray = [];
	fileArray[0] = jdf.config.configFileName;

	for (var i =0 ; i<dirArray.length  ;  i++){
		f.mkdir(dirArray[i]);
	}

	for (var i =0 ; i<fileArray.length  ;  i++){
		if (!f.exists(fileArray[i])) {
			f.write(fileArray[i],'');
		}
	}

	console.log('jdf project directory init done!');
}

/**
* @输出处理后的工程文件
* @param type 'default' : 默认输出js,css文件夹 如$ jdf o
* @param type 'debug' : debug下输出js,css和html文件夹 如$ jdf o -d
* @param type 'custom' : 自定义输出 如$ jdf o app/js/test.js
* @todo 只复制改动的文件
*/
jdf.projectOutput = function(type, list, callback){
	var outputdirName = jdf.config.outputDirName;
	var outputdir = outputdirName+'/'+jdf.getProjectPath();
	
	//[notice]输出路径暂不可配置
	var cssDir = path.normalize( jdf.bgCurrentDir + '/' + jdf.config.cssDir );
	var jsDir =  path.normalize( jdf.bgCurrentDir + '/' + jdf.config.jsDir );
	var htmlDir = path.normalize( jdf.bgCurrentDir + '/' + jdf.config.htmlDir );

	if (!f.exists(jdf.config.cssDir) && !f.exists(jdf.config.jsDir) && !f.exists(jdf.config.htmlDir)) {
		console.log('jdf tips : type "jdf init" for usage.');
		return;
	}

	var core = function(){
		var logText = 'jdf output success!';
		switch (type){
			case 'default' :
				f.copy(jsDir, outputdir+'/js');
				f.copy(cssDir, outputdir+'/css');
				break ;
			case 'debug':
				f.copy(jsDir, outputdir+'/js');
				f.copy(cssDir, outputdir+'/css');
				f.copy(htmlDir, outputdir+'/html');
				break;
			case 'custom':
				if(!list) return;
				var listArray = list.split(',');
				var itemRes='';
				for (var i=0  ; i<listArray.length  ; i++ ){
					var item = listArray[i];
					if ( f.exists(item) ) {
						var dirname = path.dirname(item);
						var basename = path.basename(item);

						var source = path.normalize( jdf.bgCurrentDir + '/'+ dirname  +'/'+ basename );
						var targetBase = outputdir + dirname.replace(jdf.config.baseDir,'');
						var target = path.normalize(targetBase +'/'+ basename );
						var targetdir = path.normalize(targetBase);
						
						f.mkdir(targetdir);
						f.copy(source, target);
						itemRes+=item+',';
					}
				}
				logText = 'jdf output ['+itemRes+'] success!';
				break;
		}
		
		//压缩
		jdf.compress(outputdirName);
		console.log(logText);
		if(callback) callback();
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
* @文件压缩初始化
* @time 2014-2-14 16:19:18
* @param src 输入文件/文件夹相对路径
* @param dest 输出文件/文件夹相对路径
*/
jdf.compressInit = function (src,dest){
	if (typeof(src) == 'undefined') {
		console.log('jdf warning no src folder');
		return;
	}
	
	var srcPath = path.normalize(f.currentDir()+'/'+src);
	var destPath;
	
	if (typeof(dest) == 'undefined') {
		destPath = srcPath;
	}else{
		destPath = path.normalize(f.currentDir() +'/'+dest);
		f.copy(srcPath, destPath);
	}

	jdf.compress(destPath);

	console.log('jdf compress success!');
}

/**
* @文件/文件夹压缩
* @param rSource 文件/文件夹绝对路径
*/
jdf.compress = function(rSource){
	var allTag = true;
	var source = f.realpath(rSource);
	if(source){
		if(f.isDir(source)){
			fs.readdirSync(source).forEach(function(name){
				if(name != '.' && name != '..' && !(/.svn/.test(name)) ) {
					allTag = jdf.compress(source + '/' + name) && allTag;
				}
			});
		} else if(f.isFile(source)){
			//js UglifyJS
			if ($.is.js(source)) {
				var sourceCode =  jdf.compressJs(source);
				f.write(source, sourceCode)
			}
			
			//css CleanCSS
			if ($.is.css(source)) {
				var sourceCode = jdf.compressCss(source);
				f.write(source, sourceCode);
			}
		} else {
			allTag = false;
		}
	} else {
		//console.log('error');
	}
	return allTag;
}

/**
* @js文件依赖替换
* @time 2014-2-21 18:46:24
* @param filename 文件名
* @param sourceCode 文件内容
* 
* 	define('me.js', function(require) {
* 		var test = require('test.js');
* 	})
* 	===>
* 	define('me.js',['test'],function(require) {
* 		var test = require('test.js');
* 	})
* 
*/
jdf.replaceJsDepend = function(sourceCode){
	var dependenceArray = [];
	sourceCode.replace(/require\('(.+)'\)/ig,function() {
		var match = arguments[1];
		//无.js缀和不含有.css的url加.js
		if (! (/\.js$/i.test(match)) && !/\.css/i.test(match)) {
			match += '.js';
		}

		dependenceArray.push('"' + match + '"');
	});
	dependenceArray = dependenceArray.join(',');

	var arrTemp = /define\((.+).*?function/gm.exec(sourceCode);
	var strTemp = arrTemp ? arrTemp[1] : null;
	// console.log(arr);
	if(strTemp){
		if(strTemp.slice().replace(/\s/g,'') == ''){
			//需要先getFileId
			//sourceCode = sourceCode.replace('define('+strTemp+'function','define([getFileId],['+dependenceArray+'],function');
		}else{
			sourceCode = sourceCode.replace(strTemp, strTemp+'['+dependenceArray+'],');
		}
	}
	return sourceCode;
};

/**
* @js文件压缩
* @param source 文件/文件夹路径
* @return compress code
*/
jdf.compressJs = function(source){
	if (!f.exists(source)) {return;}
	var sourceCode = f.read(source);
	sourceCode = jdf.replaceJsDepend(sourceCode);
	var result = UglifyJS.minify(sourceCode,{
		fromString: true,
		//warnings: true, //显示压缩报错
		output: {
			ascii_only:true
			//,beautify: true
			//,comments: true
		},
		compress:{}
		//,mangle:false //变量名字替换成短名称
	});
	return result.code;
};


/**
* @css文件压缩
* @param source 文件/文件夹路径
* @return compress code
*/
jdf.compressCss = function(source){
	if (!f.exists(source)) {return;}
	var sourceCode = f.read(source);
	var result = new CleanCSS({
		keepBreaks:false,//是否有空格
		processImport:false//是否替换@import
	}).minify(sourceCode);
	
	/*
	var j = '';
	j = jdf.getProjectPath() +	j;
	if (j.charAt(0) == '/' || j.charAt(0) == '\\' ) {
		j = j.replace('\\','');
		j = j.replace('/','');
	}

	j = jdf.config.cdn +'/'+ j+'/';//可配置

	var prefix = j + 'css/';
	*/

	var sourcedir = path.normalize( path.dirname(source) );
	var outputdir = path.normalize( f.currentDir()+'/'+jdf.config.outputDirName);

	var prefix =  jdf.config.cdn + sourcedir.replace(outputdir , '') +'/';
	prefix = prefix.replace(/\\/g, '/');
	
	result = jdf.cssImagesUrlReplace(result, prefix);
	return result;
};

/**
* css中图片路径替换
* @time 2014-2-21 10:17:13
* @param prefix 前缀
* @param suffix 后缀
* @example 
	jdf.cssImagesUrlReplace('.test{background-image:url("i/test.jpg");}','http://cdn.com/','?time=123') ===> 
	.test{background-image:url("http://cdn.com/i/test.jpg?time=123");}
*/
jdf.cssImagesUrlReplace = function (str,prefix,suffix) {
     var prefix = prefix || '';
     var suffix = suffix || '';
     var cssImagesUrlReg = new RegExp("url\\(.*?\\)","igm");
     var temp = str.match(cssImagesUrlReg);
     if (temp) {
			var tempObj = {};
			//去重
			 for (var i = temp.length - 1; i >= 0; i--) {
				tempObj[temp[i]] = 1;
			 }

			for (var i in  tempObj ){
				   var b = i;
				   b = b.replace('url(','');
				   b = b.replace(')','');
				   b = b.replace(/\s/g,'');
				   b = b.replace(/\"/g,'');
				   b = b.replace(/\'/g,'');
				   if ( b != 'about:blank' ) {
						var reg = new RegExp(b,'gim');
						if($.is.httpLink(b)){
							str = str.replace(reg,b+suffix)
						}else{
							var c = b.replace("../","");
							c = c.replace("./","");
							str = str.replace(reg,prefix+c+suffix)
						}
				   };
			  };
     };
     return str;
}


/**
* @jdj模版生成 demo/x/x.html , jd/ui/x/x.js
* @time 2014-2-18 11:39:52
*/
jdf.jdjTemplate = function(name){
	if (typeof(name) == 'undefined') {
		console.log('jdf warning : name is undefined');
		return;
	}
	var demoDir = 'demo/'+name +'/';
	var jsDir = 'jd/ui/'+name +'/';
	f.mkdir(demoDir);
	f.mkdir(jsDir);

	var demoPath = demoDir+name +'.html';
	if (!f.exists(demoPath)) {
		var demoHtml = f.read('template/template.html');
		demoHtml = demoHtml.replace(/template/gmi,name);
		f.write(demoPath,demoHtml);
		console.log('"' + demoPath +'" create');
	}else {
		console.log('"' + demoPath +'" exists');
	}
	
	var jsPath = jsDir+name +'.js';
	if (!f.exists(jsPath)) {
		var jsContent = f.read('template/template.js');
		jsContent = jsContent.replace(/template/gmi,name);
		var time = $.getDay() +' '+ $.getTime();
		jsContent = jsContent.replace(/updateTime/gmi,time);
		f.write(jsPath,jsContent);
		console.log('"' + jsPath +'" create');
	}else {
		console.log('"' + jsPath +'" exists');
	}
}

