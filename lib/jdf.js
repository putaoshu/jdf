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
var Compress = require('./compress.js');

//外部组件
var Node_watch = require('node-watch');

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
			jdf.createStandardDir();
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
			Compress.dir(argv[3],argv[4]);
		//} else if(first === 'b' || first === 'beautiful'){
		//	beautiful.init(argv[3],argv[4]);			
		
		} else if(first === 't'){
			jdf.jdjTemplate(argv[3]);

	    } else {
			console.log('jdf error [jdf.init] invalid option: '+first+' \rType "jdf -h" for usage.');
	    }
    });
};

/**
* @输入命令的初始化 build, release, output 
*/
jdf.argvInit = function(runType, argv, callback){
	if(runType == 'build' || runType == 'release'){
		jdf.bgMkdir();
		jdf.bgCopyDir();
		jdf.buildMain(runType);

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

				jdf.output(outputType, outputList, callback);
			});
		});
	}

	//jdf.openurl();
}

/**
* @读取jdf version
*/
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

		//todo:自动从服务器下载最新版的jdj和jdm,现在是需要install手动下载
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
		jdf.output('debug', null, function(){
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
	//loading打点器 todo:一行内打点
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
* @从服务器端下载jdj, jdm, demo 或其它文件
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

	jdf.openurl = function(){
		var openurl = require("openurl");
		openurl.open("http://localhost:3000/html/index.html");
	}
*/
	
/**
* @自动刷新
* @todo

	jdf.refresh = function(){
			
	}
*/

/**
* @获取项目前缀名字
* @1. d:\product\index\trunk ===> product/index
* @2. d:\product\index\branches\homebranches ===> product/index
* @3. d:\product\index\branches\homebranches ===> product
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
* @静态资源css,js链接替换处理: js直接加cdn, css链接combo后加cdn, 
* @param {String} str 源代码
* @return {String} 替换后的源代码
* @example
	<link type="text/css" rel="stylesheet"  href="../app/css/main.css" />
	<link type="text/css" rel="stylesheet"  href="../app/css/less.css" />
	==>
	<link type="text/css" rel="stylesheet"  href="http://cdnul.com/??productpath/css/main.css,productpath/css/less.css" />

	<script type="text/javascript" src="../app/js/common.js"></script>
	 ==>
	<script type="text/javascript" src="http://cdnul.com/productpath/js/common.js"></script>
*/

jdf.staticUrlReplace = function(str){
	var cssReplace= function (str,regStr){
		var reg = new RegExp(regStr,'gm');
		var regResult =  str.match(reg);
		// console.log(regResult);
		if (regResult){
			var comboArray = [];
			regResult.forEach(function(item){
				// console.log(item);
				var reg = new RegExp(regStr,'gm');
				var i = reg.exec(item);

				var cdnReg = new RegExp(jdf.config.cdn+'/', 'gm');
				if(i && cdnReg.test(i[1]) ){
					var t = i[1].replace(cdnReg, '');
					str = str.replace(i['input'], '');
					comboArray.push(t);
				}
				
				if ( i && !$.is.httpLink(i[1]) ){
					//css url
					var j = i[1];
					j = j.replace(jdf.config.baseDir, '');
					j = j.replace(/\.\.\//g,'');

					//add projectPath
					j = jdf.getProjectPath() +	j;
					// del ../ & ./
					if (j.charAt(0) == '/' || j.charAt(0) == '\\' ) {
						j = j.replace('\\','');
						j = j.replace('/','');
					}

					var widgetReg = new RegExp('^'+jdf.config.widgetDir, 'gm');
					if(! widgetReg.test(j)){
						comboArray.push(j);
						str = str.replace(i['input'], '');
					}
				}
			});
			
			if(comboArray.length>0){
				var staticUrl = jdf.config.cdn + '/??' + comboArray.join(',');
				var cssLink = '\r\n' + $.placeholder.csscomboLink(staticUrl);
				if (/<\/head>/.test(str)) {
					str = $.placeholder.insertHead(str, cssLink);
				} else{
					str += cssLink;
				};
			}
			//console.log(comboArray);
		}
		return str;
	}


	var jsReplace= function (str,regStr){
		var reg = new RegExp(regStr,'gm');
		var regResult =  str.match(reg);
		if (regResult){
			regResult.forEach(function(item){
				var reg = new RegExp(regStr,'gm');
				var i = reg.exec(item);
				if ( i && !$.is.httpLink(i[1]) ){
					//url
					var j = i[1];
					j = j.replace(jdf.config.baseDir, '');
					j = j.replace(/\.\.\//g,'');

					//add projectPath
					j = jdf.getProjectPath() +	j;
					// del ../ & ./					
					if (j.charAt(0) == '/' || j.charAt(0) == '\\' ) {
						j = j.replace('\\','');
						j = j.replace('/','');
					}
					//add cdn
					j = jdf.config.cdn + '/' + j;
					
					//replace
					var r = new RegExp(i[1],'gm');
					str = str.replace(r,j);
				}
			});
		}
		return str;
	}

	str = cssReplace(str, $.reg.cssStr);
	str = jsReplace(str, $.reg.jsStr);
	return str;
}

/**
* @build less/sass to css
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
				var target = path.normalize(jdf.bgCurrentDir + builddir + $.getCssExtname(name));

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
* @当含有jdj jdm 模块时写放当前文件一次
var writeJMOnce= false;
*/

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
	{%widget name="unit"%} 
	==> 
	<link type="text/css" rel="stylesheet"  href="/widget/base/base.css" source="widget"/>
	==>
	<link type="text/css" rel="stylesheet"  href="/app/css/widget.css" source="widget"/>
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
			var pkgName = jdf.config.widgetDir;
			var outputDir = jdf.bgCurrentDir;
			var outputCss = '/' + jdf.config.cssDir+'/'+pkgName+'.css';
			var outputJs = '/' + jdf.config.jsDir+'/'+pkgName+'.js';

			if (type == 'output') {
				outputCss = jdf.config.cdn +'/' +  jdf.getProjectPath() + '/css/'+pkgName+'.css';
				outputJs = jdf.config.cdn +'/' + jdf.getProjectPath() + '/js/'+pkgName+'.js';
			}

			var cssLink = $.placeholder.cssLink(outputCss);
			
			//css链接加前缀
			content = $.placeholder.insertHead(content, cssLink  );
			f.write(path.normalize(outputDir+'/' + jdf.config.cssDir+'/'+pkgName+'.css') , cssFile);
			
			//js链接加前缀
			var jsLink = $.placeholder.jsLink(outputJs) ;
			content = $.placeholder.insertBody(content, jsLink );
			//取内容写入pkg文件中
			f.write(path.normalize(outputDir+'/' + jdf.config.jsDir+'/'+pkgName+'.js') , jsFile);
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
jdf.createStandardDir = function(){
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
* @param {String} type 'default' : 默认输出js,css文件夹 如$ jdf o
* @param {String} type 'debug' : debug下输出js,css和html文件夹 如$ jdf o -d
* @param {String} type 'custom' : 自定义输出 如$ jdf o app/js/test.js
* @param {String} list  : 自定义输出的文件路径,如app/js/test.js
* @param {Function} callback 回调函数
* @todo 只复制改动的文件
*/
jdf.output = function(type, list, callback){
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
				f.copy(cssDir, outputdir+'/css', null, 'sless|css');
				break ;
			case 'debug':
				f.copy(jsDir, outputdir+'/js');
				f.copy(cssDir, outputdir+'/css', null, 'less|scss');
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
		Compress.init(outputdirName);
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

