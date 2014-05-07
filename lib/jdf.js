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
var Openurl = require("./openurl.js");
var Widget = require("./widget.js");
var Config = require("./config.js");
var Log = require("./log.js");
var BuildCss = require("./buildCss.js");
var BuildWidget = require("./buildWidget.js");

//外部组件
var Node_watch = require('node-watch');
var Livereload = require('./livereloadServer');

//define
var jdf = module.exports;

/**
* @配置项
*/
jdf.config = Config;

/**
* @commoder help
*/
jdf.help = function(){
	var content = [];
    content = content.concat([
        '',
        '  Usage: jdf <Command>:',
        '',  
        '  Command:',
        '',
	  	'    install		install init dir, demo',		
	  //'    init		project directory init',
        '    build		build project',
        '          -open		auto open html/index.html ',
        '',
        '    release		release project',
        '',
        '    output		output project',
        '          -html		output project (include html) ',
        '          dirname	output your own custom dirname',
        '          -debug    	uncompressed js,css,images for test' ,        
        '          -backup	backup outputdir to tags dir',
        '',
        '    upload		upload output files to remote sever',
        '          -html		upload output project (include html) ',
        '          dirname	upload output your own custom dirname',
        '          -debug    	uncompressed js,css,images for test' ,
        '          -custom    	upload a dir/file to server' ,
        '          -preview    	upload html dir to preview server dir' ,
        '',
        '    widget',
        '      	  -all  	preview all widget',
        '      	  -preview  	preview a widget',
        '      	  -install  	install a widget',
        '      	  -publish  	publish a widget',
      //'    u   -w	watch upload output files to remote sever',
		' ',
		'  Extra commands:',
        '',
		'    compress		compress js/css (jdf compress input output)',
	 	'    clean		clean cache folder', //todo
	 //'    t			create jdj template(jdf t name)',
        '    -h			get help information',
        '    -v			get the version number',
        //'',
		//'  Example:',
		//'',
		//'   jdf install init',
		''
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
	    var cmd2 = argv[2];
		jdf.currentDir = f.currentDir();

	    if(argv.length < 3 || cmd2 === '-h' ||  cmd2 === '--help'){
	        jdf.help();
	    	Log.send('help');	        
	    } else if(cmd2 === '-v' || cmd2 === '--version'){
	        jdf.version();
	    	Log.send('version');	        
	    } else if(cmd2[0] === '-'){
	        jdf.help();
			Log.send('help');
		} else if(cmd2 === 'b' || cmd2 === 'build'){
			jdf.argvInit('build', argv);	
			Log.send('build');
		} else if(cmd2 === 'r' || cmd2 === 'release'){
			jdf.argvInit('release', argv);
			Log.send('release');	
		} else if(cmd2 === 'o' || cmd2 === 'output'){
			jdf.argvInit('output', argv);
			Log.send('output');	
		} else if(cmd2 === 'u' || cmd2 === 'upload'){
			jdf.upload(argv);
			Log.send('upload');			
		} else if(cmd2 === 'i' || cmd2 === 'install'){
			switch(argv[3]){
				case  'demo':
					jdf.install('demo')
					Log.send('install-demo');
					return ;
				case  'init':
					jdf.install('init')
					Log.send('install-init');
					return ;
				default:
					console.log('You can "jdf install demo or "jdf install init"');
			}
		} else if(cmd2 === 'c' || cmd2 === 'compress'){
			Compress.dir(argv[3],argv[4]);
			Log.send('compress');
		//widget
		} else if(cmd2 === 'w' || cmd2 === 'widget'){
			var cmd3 = argv[3],cmd4=argv[4];
			if ( cmd3 == '-all' || cmd3 == '-all' ) {
				Widget.all(cmd4);
				Log.send('widget-all');
			}

			if (cmd3 && !cmd4 && cmd3 != '-all') {
				console.log('jdf tips [jdf.init] Please input widget name');
			}

			if (cmd3 && cmd4) {
				if ( cmd3 == '-preview' || cmd3 == '-p' ) {
					Widget.preview(cmd4);
					Log.send('widget-preview');
				}else if ( cmd3 == '-install' || cmd3 == '-i' ) {
					Widget.install(cmd4);
					Log.send('widget-install');
				}else if ( cmd3 == '-publish' || cmd3 == '-pub' ) {
					Widget.publish(cmd4);
					Log.send('widget-publish');
				// list search
				}
			}

			if (!cmd3) {
				var content = [];
				content = content.concat([
					'',
					'  Command:',
					'',
					'    widget',
					'      	  -all  	preview all widget',
					'      	  -preview  	preview a widget',
					'      	  -install  	install a widget',
					'      	  -publish  	publish a widget',
					''
				]);
				console.log(content.join('\n'));
			}
		//extra commands
		} else if(cmd2 === 'clean'){
			Log.send('clean');
			jdf.clean();
		} else if(cmd2 === 't'){
			jdf.jdjTemplate(argv[3]);
		//beautiful
	    } else {
			console.log('jdf error [jdf.init] invalid option: '+cmd2+' \rType "jdf -h" for usage.');
	    }
    });
};

/**
* @输入命令的初始化 build, release, output 
*/
jdf.argvInit = function(runType, argv, callback){
	if(runType == 'build' || runType == 'release'){
		var autoOpenurl = false;
		if ( typeof(argv[3]) != 'undefined'){
			if(argv[3] == '-open') autoOpenurl = true;
		}

		jdf.bgMkdir();
		jdf.bgCopyDir();
		jdf.buildMain(runType);

		jdf.server(autoOpenurl);
		jdf.watch(runType, callback);
	}else if (runType == 'output'){
		jdf.bgMkdir();

		//rename
		//var dirname = path.dirname(jdf.bgCurrentDir);
		//var extname = path.extname(jdf.bgCurrentDir);
		//var newname = dirname+'/'+jdf.bgCurrentDirName+$.getDay('')+$.getTime('');
		//fs.rename(jdf.bgCurrentDir, newname,function(err,data){

		f.del(jdf.bgCurrentDir,function(){
			f.mkdir(jdf.bgCurrentDir);
			jdf.bgMkdir(runType);
			jdf.bgCopyDir();
			jdf.buildMain(runType);

			//默认
			var outputType = 'default' ,outputList, isbackup = false, isdebug = false;
			
			if ( typeof(argv[3]) != 'undefined' ){
				var cmd3 = argv[3];
				var cmd4 = argv[4];

				//custom自定义
				outputType = 'custom';
				outputList = cmd3;
				
				//debug(不压缩)
				if (cmd3 == '-debug' || cmd4 == '-debug') {
					isdebug = true;
					if(!cmd4) outputType = 'default';
				}

				//hashtml
				if (cmd3 == '-html') {
					outputType = 'hashtml';
					outputList = null;
				}
				
				//backup
				if (cmd3 == '-backup' || cmd4 == '-backup') {
					outputType = 'backup';
					isbackup = true;
					if (cmd4 == '-backup') {
						outputType = 'custom';
						outputList = cmd3;
					}
				}
			}else {
				//按配置项来输出
				if (jdf.config.outputCustom) {
					outputType = 'custom';
					outputList = jdf.config.outputCustom;
				}
			}
		
			jdf.output({
				type: outputType,
				list: outputList,
				isbackup: isbackup,
				isdebug: isdebug,
				callback: callback
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
		temp = path.normalize(temp);
		f.mkdir(temp);
		
		//项目缓存文件夹
		var cacheDir  = temp + '/cache/';
		cacheDir = path.normalize(cacheDir);
		f.mkdir(cacheDir);
		jdf.cacheDir = cacheDir;

		//项目temp文件夹
		var tempDir  = temp + '/temp/';
		tempDir = path.normalize(tempDir);
		f.mkdir(tempDir);
		jdf.tempDir = tempDir;

		var lib  = temp + '/lib/';
		lib = path.normalize(lib);
		jdf.libDir = lib;
		f.mkdir(lib);

		//todo:自动从服务器下载最新版的jdj和jdm,现在是需要install手动下载
		var jdj  = lib + '/jdj/';
		jdj = path.normalize(jdj);
		jdf.jdjDir = jdj;
		f.mkdir(jdj);

		var jdm  = lib + '/jdm/';
		jdm = path.normalize(jdm);
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
* @仅copy app,html,widget, config文件
*/
jdf.bgCopyDir =function(){
	f.copy(jdf.currentDir+'/'+ jdf.config.baseDir, jdf.bgCurrentDir  +'/'+ jdf.config.baseDir);
	f.copy(jdf.currentDir+'/'+ jdf.config.htmlDir, jdf.bgCurrentDir  +'/'+ jdf.config.htmlDir);
	f.copy(jdf.currentDir+'/'+ jdf.config.widgetDir, jdf.bgCurrentDir  +'/'+ jdf.config.widgetDir);
	f.copy(jdf.currentDir+'/'+ jdf.config.configFileName, jdf.bgCurrentDir  +'/'+ jdf.config.configFileName);
}

/**
* @屏幕打点器
* @time 2014-3-14 07:08
* @example 
*	begin: jdf.dot.begin()  end: jdf.dot.end(); 
*/
jdf.dot = {
	timer:null,
	begin:function(){
		this.date = new Date();
		process.stdout.write('.');
		this.timer = setInterval(function(){
			  process.stdout.write('.');
		},1000);
	},
	end:function(haslog){
		var haslog = typeof(haslog) == 'undefined' ? true : haslog;
		if (this.timer) {
			var date = new Date();
			clearInterval(this.timer);
			if(haslog){
				console.log('\r\njdf spend '+(date - this.date)/1000 +'s');
			}else {
				console.log();
			}
		}
	}
}
 
/**
* @upload
* @time 2014-2-26 19:17:39
* @param {Function} callback custom模式下回调函数
* @param {Boolse} haslog custom模式下是否显示log
* @example
*	jdf upload (default first run "jdf output -html")
*	jdf upload js/a.js (first run "jdf output js/a.js")
*	jdf upload -custom localdir serverdir (serverdir no exists, the same localdir)
*  
*  another call method 
*  	jdf.upload([0, 0, 0, '-custom', 'localdirname', 'serverdirname'], true ,function(){})
*  
*/
jdf.upload = function(argv, haslog, callback){
	var haslog = typeof(haslog) == 'undefined' ? true : haslog;
	var ftp = {};
	var uploadSource = path.normalize(f.currentDir()+'/' + jdf.config.outputDirName);
	var uploadTarget = jdf.config.serverDir;

	//core function
	var ftpFn = function(source, target){
		if(jdf.config.host){
			ftp = require('./ftp.js');
			ftp.upload(source, target, null, null, null, null, null, function(err){
				jdf.dot.end(haslog);
				if(haslog) console.log('jdf upload ['+jdf.config.host +'/'+ target+'] success!');
				if(callback) callback();
			});
		}else{
			console.log('jdf error [jdf.upload] - server host no setup');
		}
	}
	
	//default upload,do "jdf output -html" first
	var outputFnOnce = function(){
		if (typeof(argv[3]) == 'undefined') {
			//argv[3] = '-html';
		}

		jdf.argvInit('output', argv, function(){
			ftpFn(uploadSource, uploadTarget);
		});
	}

	//watch upload
	var outputFnWatch = function(){
		ftp.quit();
		jdf.buildMain('output');
		jdf.output({
			type:'hashtml',
			callback:function(){
				ftpFn(uploadSource, uploadTarget);
			}
		});
	}
	
	//entrance
	if (argv[3] == '-watch') {
		//watch upload
		outputFnOnce();
		Node_watch(f.currentDir(), function(filename) {
			console.log(filename);
			outputFnWatch();
		});
	}else if(argv[3] == '-custom' && argv[4] ){
		//custom upload	
		if ( f.exists(argv[4]) ) {
			var serverdir = argv[5] ? argv[5] : argv[4];
			console.log('jdf uploading');
			jdf.dot.begin();
			ftpFn(argv[4], serverdir);
		} else{
			console.log('jdf warning [jdf.upload] - "'+argv[4]+'" not exists');
		};
	}else if( (argv[3] == '-preview' || argv[3] == '-p' ) && jdf.config.previewServerDir ){
		//preview
		argv[3] = jdf.config.buildDirName;
		jdf.argvInit('output', argv, function(){
			ftpFn(uploadSource, jdf.config.previewServerDir);
		});
	}else {
		//default upload
		outputFnOnce();
	}
}

/**
  * @从服务器端下载文件 todo:检查版本号
  */
jdf.download = function(pathItem, targetDir){	
	var url = jdf.config[pathItem];
	var cacheDir = path.normalize(jdf.cacheDir +'/'+pathItem+'.tar');
	
	console.log('jdf downloading');
	jdf.dot.begin();

	f.download(url, cacheDir , function(data){
		if (data == 'ok') {
			f.tar(cacheDir, targetDir, function(){
				console.log('\r\njdf ['+pathItem+'] install done');
				jdf.dot.end(false);
			});
		}else if (data == 'error') {
			jdf.dot.end(false);
		}
	})
}

/**
* @从服务器端下载jdj, jdm, demo 或其它文件
*/
jdf.install = function(param){
	jdf.bgMkdir();
		
	/**
	widget模块安装走jdf widget -install widget/header
	console.log('jdf downloading');
	jdf.download('jdj', jdf.libDir);
	jdf.download('jdm', jdf.libDir);
	*/
	if(param == 'demo'){
		jdf.download('demo', jdf.currentDir );
	}else if(param == 'init'){
		jdf.createStandardDir();
	}
}

/**
* @服务器
* @param {Boolse}  
	autoOpenurl true: html/index.html存在的话则打开, 不存在打开 http://localhost:3000/
	autoOpenurl false: 只启动不打开网页
*/
jdf.server = function(autoOpenurl){
	Server.init(jdf.bgCurrentDir, jdf.config.localServerPort);
	if ( typeof(autoOpenurl) != 'undefined' && autoOpenurl){
		var homepage = '/'+jdf.config.htmlDir+'/index.html';
		if (! f.exists(jdf.currentDir+homepage) ){
			homepage = '';
		}
		jdf.openurl('http://localhost:'+jdf.config.localServerPort+'' + homepage);
	}

	console.log('jdf server running at http://localhost:'+jdf.config.localServerPort+'/');
}

/**
 * @检测路径是否为项目文件夹内路径 即 baseDir htmlDir widgetDir configFile
 * @param {String} filename 文件路径
 */
jdf.checkProjectDir = function(filename){
	var dirname = filename.replace(jdf.currentDir, '');
	dirname = dirname.replace(/\\/,'');
	if ( /^\//.test(dirname) ) dirname = dirname.replace(/\//,'');
		
	var checkTag = false;
	var checkProjectDir = function(i, j){
		 var reg = new RegExp('^'+i);
		 if (reg.test(j)) {
			return true;
		 }else {
			return false;
		 }
	}
	
	if (checkProjectDir(jdf.config.baseDir, dirname) 
		|| checkProjectDir(jdf.config.htmlDir, dirname) 
		|| checkProjectDir(jdf.config.widgetDir, dirname) 
		|| checkProjectDir(jdf.config.configFileName, dirname) 
	) {
		checkTag = true;
	}
	return checkTag;
}

/**
* @watch && Livereload
* @复制有变动的文件
*/
jdf.watch = function(type, callback){
	//livereload
	Livereload.init();

	Node_watch(jdf.currentDir, function(filename) {
		var target = jdf.bgCurrentDir  +  filename.replace(jdf.currentDir, '');
		if (jdf.checkProjectDir(filename)) {
			f.copy(filename, target);
			//jdf.bgCopyDir();
			jdf.buildMain(type);
			if (callback) callback(filename);

			//livereload
			Livereload.reloadBrowser([target]);
		}
	});
}
	
/**
* @openurl
* @todo : 仅打开一次
*/
jdf.openurl = function(url){
	if (typeof(url) == 'undefined') {
		var url = "http://localhost:3000/html/index.html";
	}
	Openurl.open(url);
}

/**
* @自动刷新
* @todo

	jdf.refresh = function(){
			
	}
*/

/**
* @获取当前项目父级目录
* @1. d:\product\index\trunk ===> d:\product/index
* @2. d:\product\index\branches\homebranches ===> d:\product/index
* @3. d:\product\index\homebranches ===> d:\product
*/
jdf.getProjectParentPath = function(currentDir){
	var nowDir = '';
	if ( /branches/.test(currentDir) ) {
		nowDir = path.resolve(currentDir, '../' , '../' );
	}else if(/trunk/.test(currentDir)){
		nowDir = path.resolve(currentDir, '../');
	}
	return nowDir;
}

/**
* @获取项目前缀名字
* @1. d:\product\index\trunk ===> product/index
* @2. d:\product\index\branches\homebranches ===> product/index
* @3. d:\product\index\homebranches ===> product
*/
jdf.getProjectPath = function(){
	var currentDir = f.currentDir() ,nowDir='', result='';
	if(jdf.config.projectPath != null){
		result = jdf.config.projectPath;
	}else{
		nowDir = jdf.getProjectParentPath(currentDir);

		if (nowDir) {
			nowDir = nowDir.split(path.sep);
			var nowDirArrayLength = nowDir.length;
			result = nowDir[nowDirArrayLength-2] +'/'+ nowDir[nowDirArrayLength-1];
		}
	}
	return result;	
}



/**
* @当含有jdj jdm 模块时写放当前文件一次
var writeJMOnce= false;
*/

/**
* @build widget, css(sass, less)
*/
jdf.buildMain = function(type){
	var builddir = '/'+jdf.config.buildDirName+'/';
	var basedir = jdf.currentDir+builddir;
	
	//build css
	BuildCss.init(jdf.config.cssDir, jdf.bgCurrentDir+'/'+jdf.config.cssDir);
	BuildCss.init(jdf.config.widgetDir, jdf.bgCurrentDir+'/'+jdf.config.widgetDir);
	
	//widget build
	if(f.exists(basedir)){
		fs.readdirSync(basedir).forEach(function(name){
			if( /.html$/.test(name) ) {
				var source = basedir+name;
				var target = path.normalize(jdf.bgCurrentDir + builddir + name);

				BuildWidget.init(source, f.read(source), type, function(data){
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
			f.write(fileArray[i], jdf.config.configContent);
		}
	}

	console.log('jdf project directory init done!');
}

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
jdf.output = function(options){
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

	if (!f.exists(jdf.config.cssDir) && !f.exists(jdf.config.jsDir) && !f.exists(jdf.config.htmlDir)) {
		console.log('jdf tips : type "jdf init" for usage.');
		return;
	}
	
	var core = function(){
		var logText = 'jdf output success!';
		var copyDefaultDir = function(){
			var cssOutputDir = outputdir + '/' + jdf.config.cssDir.replace(jdf.config.baseDir+'/', '');
			var imagesOutputDir = outputdir + '/' + jdf.config.imagesDir.replace(jdf.config.baseDir+'/', '');
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
							jdf.backup(item);
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
			jdf.backup();
		}	

		//压缩
		if (!isbackup && customTag) {
			Compress.init(outputdirName, isdebug);
			console.log(logText);
		}

		if(callback && customTag) {
			callback();
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
jdf.backup = function(dirname){
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


/**
* @jdj模版生成 demo/x/x.html , jd/ui/x/x.js
* @time 2014-2-18 11:39:52
*/
jdf.jdjTemplate = function(name){
	if (typeof(name) == 'undefined') {
		console.log('jdf warning : name is undefined');
		return;
	}
	var demoDir = 'unit_demo/'+name +'/';
	var jsDir = 'jd/ui/'+name +'/';
	f.mkdir(demoDir);
	// f.mkdir(jsDir);

	var demoPath = demoDir+name +'.html';
	if (!f.exists(demoPath)) {
		var demoHtml = f.read('template/template_unit.html');
		demoHtml = demoHtml.replace(/template/gmi,name);
		f.write(demoPath,demoHtml);
		console.log('"' + demoPath +'" create');
	}else {
		console.log('"' + demoPath +'" exists');
	}
	
	/*var jsPath = jsDir+name +'.js';
	if (!f.exists(jsPath)) {
		var jsContent = f.read('template/template.js');
		jsContent = jsContent.replace(/template/gmi,name);
		var time = $.getDay() +' '+ $.getTime();
		jsContent = jsContent.replace(/updateTime/gmi,time);
		f.write(jsPath,jsContent);
		console.log('"' + jsPath +'" create');
	}else {
		console.log('"' + jsPath +'" exists');
	}*/
}

/**
* @清除项目缓存文件夹
*/
jdf.clean = function(){
	jdf.bgMkdir();
	f.del(jdf.tempDir, function(){
		console.log('jdf cache dir clean done');
	});
}
