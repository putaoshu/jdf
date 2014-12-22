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
var Output = require("./output.js");
var FindPort = require('./findPort');
var FileLint = require('./fileLint');
var FileFormat = require('./FileFormat');

//外部组件
var Node_watch = require('node-watch');
var Livereload = require('./livereloadServer');

//define
var jdf = module.exports;

/**
* @配置项
*/
jdf.config = Config;
var PORT = require('../template/config.json').localServerPort 
|| jdf.config.localServerPort;

/**
* @commoder help
*/
jdf.help = function(){
	var content = [];
    content = content.concat([
        '',
        '  Usage: jdf <Command>',
        '',  
        '  Command:',
        '',
        '    install      install init dir, demo',        
        //'  init         project directory init',
        '    build        build project',
        '      -open      auto open html/index.html ',
        '      -combo     combo debug for online/RD debug',
        '      -css       compile less/scss file in current dir',
        '',
        '    release      release project',
        '',
        '    output       output project',
        '      -html      output project (include html) ',
        '      dirname    output your own custom dirname',
        '      -debug     uncompressed js,css,images for test' ,        
        '      -backup    backup outputdir to tags dir',
        '',
        '    upload       upload css/js dir to remote sever',
        //'    -html      upload output project (include html) ',
        '      dirname    upload output your own custom dirname',
        '      -debug     uncompressed js,css,images for test' ,
        '      -custom    upload a dir/file to server' ,
        '      -preview   upload html dir to preview server dir' ,
        '      -nc        upload css/js dir to preview server dir use newcdn url' ,
        '      -nh        upload html dir to preview server dir use newcdn url' ,
        '',
        '    widget',
        '      -all       preview all widget',
        '      -list      get widget list from server',
        '      -preview xxx  preview a widget',
        '      -install xxx  install a widget to local',
        '      -publish xxx  publish a widget to server',
        '      -create xxx   create a widget to local',
        //'    -w    watch upload output files to remote sever',
        '',
        '    server       debug for online/RD debug',        
        '    lint         file lint',
        '    format       file formater',
        ' ',
        '  Extra commands:',
        '',
        '    compress     compress js/css (jdf compress input output)',
        '    clean        clean cache folder',
        '    -h           get help information',
        '    -v           get the version number',
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
	jdf.getConfig(function(configData){
	    var cmd2 = argv[2];
		jdf.currentDir = f.currentDir();
	    //  合并同一种执行逻辑的执行条件
	    if(argv.length < 3 || cmd2 === '-h' ||  cmd2 === '--help' || cmd2[0] === '-'){
	    	Log.send('help');
	        jdf.help();

	    } else if(cmd2 === '-v' || cmd2 === '--version'){
	        Log.send('version');
	        jdf.version();

		} else if(cmd2 === 'b' || cmd2 === 'build'){
			Log.send('build');
			jdf.argvInit('build', argv);	

		} else if(cmd2 === 'r' || cmd2 === 'release'){
			Log.send('release');
			jdf.argvInit('release', argv);	

		} else if(cmd2 === 'o' || cmd2 === 'output'){
			Log.send('output');
			jdf.argvInit('output', argv);

		} else if(cmd2 === 'u' || cmd2 === 'upload'){
			Log.send('upload');
			jdf.upload(argv, configData);	

		} else if(cmd2 === 'i' || cmd2 === 'install'){
			switch(argv[3]){
				case  'demo':
					Log.send('install-demo');
					jdf.install('demo')
					return;
				case  'init':
					Log.send('install-init');
					jdf.install('init')
					return;
				default:
					console.log('You can "jdf install demo or "jdf install init"');
			}

		} else if(cmd2 === 'c' || cmd2 === 'compress'){
			Log.send('compress');
			Compress.dir(argv[3],argv[4]);

		//widget
		} else if(cmd2 === 'w' || cmd2 === 'widget'){
			var cmd3 = argv[3],cmd4=argv[4],cmd5=argv[5];
			var force = cmd5 != 'undefined' && cmd5 == '-force' ? true : false

			if ( cmd3 == '-all' || cmd3 == '-a'){
				Log.send('widget-all');
				Widget.all(cmd4);
			}

			if ( cmd3 == '-list' || cmd3 == '-l'){
				Log.send('widget-list');
				Widget.list(cmd4);
			}

			var hasCmd4 = function (){
				if(cmd4){
					return true;
				}else{
					console.log('jdf tips [jdf.init] Please input widget name');
					return false;
				}	
			}

			var widgetCmd = function (){
				var content = [];
				content = content.concat([
					'',
					'  Command:',
					'',
					'    widget',
					'      -all     preview all widget',
					'      -list    get widget list from server',
			        '      -preview xxx 	preview a widget',
			        '      -install xxx 	install a widget to local',
			        '      -publish xxx 	publish a widget to server',
			        '      -create  xxx 	create a widget to local',
					''
				]);
				console.log(content.join('\n'));
			}

			if (cmd3) {
				if ( cmd3 == '-preview' || cmd3 == '-pre' && hasCmd4() ) {
					Log.send('widget-preview');
					Widget.preview(cmd4);

				}else if ( cmd3 == '-install' || cmd3 == '-i'  && hasCmd4() ) {
					Log.send('widget-install');
					Widget.install(cmd4, force);

				}else if ( cmd3 == '-publish' || cmd3 == '-p' && hasCmd4() ) {
					Log.send('widget-publish');
					Widget.publish(cmd4, force );

				}else if ( (cmd3 == '-create' || cmd3 == '-c') && hasCmd4() ) {
					Log.send('widget-create');
					Widget.create(cmd4);

				}
			}

			if (!cmd3) {
				widgetCmd();
			}

		//extra commands
		//server
		} else if(cmd2 === 'server'){
			Log.send('server');
			jdf.server('./', PORT, jdf.config.cdn, jdf.getProjectPath(), true);
		
		//file lint
		} else if(cmd2 === 'lint' || cmd2 === 'l'){
			var cmd3 = argv[3];
			var filename = (typeof(cmd3) == 'undefined') ? f.currentDir() : cmd3;
			Log.send('file lint');
			FileLint.init(filename);

		//file format
		} else if(cmd2 === 'format' || cmd2 === 'f'){
			var cmd3 = argv[3];
			var filename = (typeof(cmd3) == 'undefined') ? f.currentDir() : cmd3;
			Log.send('file format');
			FileFormat.init(filename);

		//clean	
		} else if(cmd2 === 'clean'){
			Log.send('clean');
			jdf.clean();

		//todo: beautiful/jsbin/
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
		if(runType == 'build' && typeof(argv[3]) != 'undefined' && argv[3] == '-css' ){
			jdf.buildCss();
		}else{
			var autoOpenurl = false,  comboDebug = false;
			if ( typeof(argv[3]) != 'undefined'){
				if(argv[3] == '-open' || argv[3] == '-o' ) autoOpenurl = true;
				if(argv[3] == '-combo' || argv[3] == '-c') comboDebug = true;
			}

			jdf.bgMkdir();
			jdf.bgCopyDir();
			jdf.buildMain(runType);

			jdf.server(autoOpenurl, comboDebug, function(data){
				jdf.watch(runType, callback, data);
			});
		}
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
			//console.log('jdf process: making temp directory.');

			jdf.bgCopyDir();
			//console.log('jdf process: copying project files.');

			jdf.buildMain(runType);
			//console.log('jdf process: building project files.');

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
			
			try{
				Output.init({
					type: outputType,
					list: outputList,
					isbackup: isbackup,
					isdebug: isdebug,
					callback: callback
				});
			}catch(e){
				console.log(e);
			}
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
				if (typeof(data) == 'object'){
					data = $.merageObj(jdf.config, data);
				}
				//console.log(data);
				res = data;
			}
			if(callback) callback(res);
		}catch(e){
			console.log('jdf error [jdf.getConfig] - config.json format error' );
			console.log(e);
			if(callback) callback(res);
		}
	}else{
		if(callback) callback(res);
	}
}

/**
* @工程后台文件夹生成
* @jdf.bgCurrentDir 为后台文件根目录
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
		
		//创建文件夹
		var creatDir = function(filename){
			var dir  = path.normalize( temp + '/'+filename+'/' );
			f.mkdir(dir);
			jdf[filename+'Dir'] = dir;
		};

		//项目缓存文件夹
		creatDir('cache');
		//项目temp文件夹
		creatDir('temp');
		//项目lib文件夹
		//todo:自动从服务器下载最新版的jdj和jdm,现在是需要install手动下载
		creatDir('lib');
		//creatDir('jdj');
		//creatDir('jdm');

		//复制当前项目至temp文件夹(除outputdir)
		//取得当前工程名
		var currentDirName = path.basename(jdf.currentDir);
		jdf.bgCurrentDir = path.normalize(jdf.tempDir +'/'+ currentDirName);
	
		jdf.bgCurrentDirName = currentDirName;
		f.mkdir(jdf.bgCurrentDir);
	}
}

/**
* @复制当前项目至工程后台目录
* @仅copy app,html,widget, config文件
*/
jdf.bgCopyDir =function(){
	if(jdf.config.baseDir != '' || jdf.config.outputCustom){
		f.copy(jdf.currentDir+'/'+ jdf.config.baseDir, jdf.bgCurrentDir  +'/'+ jdf.config.baseDir);
	}

	f.copy(jdf.currentDir+'/'+ jdf.config.cssDir, jdf.bgCurrentDir  +'/'+ jdf.config.cssDir);
	f.copy(jdf.currentDir+'/'+ jdf.config.imagesDir, jdf.bgCurrentDir  +'/'+ jdf.config.imagesDir);
	f.copy(jdf.currentDir+'/'+ jdf.config.jsDir, jdf.bgCurrentDir  +'/'+ jdf.config.jsDir);
	
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
* @param {Boolse} hasConfig 配置文件是否存在
* @example
*	jdf upload (default first run "jdf output -html")
*	jdf upload js/a.js (first run "jdf output js/a.js")
*	jdf upload -custom localdir serverdir (serverdir no exists, the same localdir)
*  
*  another call method 
*  	jdf.upload([0, 0, 0, '-custom', 'localdirname', 'serverdirname'], true ,function(){})
*  
*/
jdf.upload = function(argv, hasConfig, haslog, callback){
	var haslog = typeof(haslog) == 'undefined' ? true : haslog;
	var hasConfig = typeof(hasConfig) == 'undefined' ? true : hasConfig;
	var ftp = {};
	var uploadSource = path.normalize(f.currentDir()+'/' + jdf.config.outputDirName);
	var uploadTarget = jdf.config.serverDir;
	
	if(!hasConfig){
		console.log('jdf error: "config.json" is not exists');
		return;
	}

	if(jdf.config.host == JSON.parse(jdf.config.configJsonFileContent).host){
		console.log('jdf error: config.json "host" error');
		return;
	}
	
	//core function
	var ftpFn = function(source, target){
		if(jdf.config.host){
			//console.log('jdf process: uploading [' + source + '].');
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
		Output.init({
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
	}else if( argv[3] == '-nc' && jdf.config.newcdn ){
		//newcdn css/js/widget
		if (typeof(argv[4]) != 'undefined'){
			argv[3] = argv[4];
			delete argv[4];
		}else{
			delete argv[3];
		}

		jdf.config.cdn = jdf.config.newcdn;
		outputFnOnce();
	}else if( argv[3] == '-nh' && jdf.config.newcdn){
		//newcdn html
		argv[3] = jdf.config.buildDirName;
		//内链link src替换
		jdf.config.cdnDefalut = jdf.config.cdn;
		jdf.config.cdn = jdf.config.newcdn;
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
	autoOpenurl true: html/index.html存在的话则打开, 不存在打开 http://localhost:PORT/
	autoOpenurl false: 只启动不打开网页
* @param {Boolse}  comboDebug 联调/线上调试模式
*/
jdf.server = function(autoOpenurl, comboDebug, callback){
	FindPort(PORT, function(data){
		if (!data) {
			console.log('findPort : Port ' + PORT + ' has used');
			PORT += 1000;
			jdf.config.localServerPort = PORT;
		}
		Server.init(jdf.bgCurrentDir, PORT, jdf.config.cdn, jdf.getProjectPath(), comboDebug);
		
		if ( typeof(autoOpenurl) != 'undefined' && autoOpenurl){
			var homepage = '/'+jdf.config.htmlDir+'/index.html';
			if (! f.exists(jdf.currentDir+homepage) ){
				homepage = '';
			}
			jdf.openurl('http://localhost:' + PORT);
		}

		console.log('jdf server running at http://localhost:' + PORT + '/');
		if('function' === typeof callback) {
			callback(data);
		};
	});
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
jdf.watch = function(type, callback, data){
	if (!data) {
		//如果有另外一个进程那么livereload会直接关闭
		jdf.config.build.livereload = false;
		//console.log("another jdf process running , jdf livereload closed"); 
	}

	//livereload
	if(jdf.config.build.livereload) Livereload.init();

	var regStr = '\\.(vm|tpl|shtml|html|js|css|less|sass|scss|json|'+$.imageFileType()+')$';
	var reg = new RegExp(regStr);
	
	//todo初始化时前后台文件夹同步
	Node_watch(jdf.currentDir, function(filename) {
		//文件过滤
		if(f.isFile(filename)){
			if(!reg.test(filename)) return;
		}

		var target = jdf.bgCurrentDir  +  filename.replace(jdf.currentDir, '');
		if (jdf.checkProjectDir(filename)) {
			if(f.exists(filename)){
				f.copy(filename, target, regStr);
				//build
				jdf.buildMain(type);
				//livereload
				if(jdf.config.build.livereload) Livereload.reloadBrowser([target]);
				if (callback) callback(filename);
			}else{
				f.del(target, function (){
					if (callback) callback(filename);		 
				});
			}
		}
	});

	if (callback) callback();
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
* @仅从配置文件中取,不再支持branch/trunk 2014-5-24  
* @del --> 1. d:\product\index\trunk ===> product/index
* @del --> 2. d:\product\index\branches\homebranches ===> product/index
* @del --> 3. d:\product\index\homebranches ===> product
*/
jdf.getProjectPath = function(){
	var currentDir = f.currentDir() ,nowDir='', result='';
	if(jdf.config.projectPath != null){
		result = jdf.config.projectPath;
	}else{
		//当前文件夹的文件夹命名为projectPath 2014-6-9
		result = path.basename(f.currentDir());
		/*
		nowDir = jdf.getProjectParentPath(currentDir);
		
		if (nowDir) {
			nowDir = nowDir.split(path.sep);
			var nowDirArrayLength = nowDir.length;
			result = nowDir[nowDirArrayLength-2] +'/'+ nowDir[nowDirArrayLength-1];
		}*/
	}
	return result;	
}



/**
* @当含有jdj jdm 模块时写放当前文件一次*/
var writeJMOnce= false;


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
		var basedirlist = f.getdirlist(basedir, '.html');
		basedirlist.forEach(function(source){
			var target = path.normalize( jdf.bgCurrentDir + builddir +  source.replace(basedir, '') );
			BuildWidget.init(source, f.read(source), type, function(data){
				f.write(target , data.tpl);
				
				if (writeJMOnce){
					f.write(source , data.origin);
				}
				return 'ok';
				
			});
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

	for (var i =0 ; i<dirArray.length  ;  i++){
		f.mkdir(dirArray[i]);
	}

	var fileArray = [];
	fileArray[0] = jdf.config.configFileName;
	fileArray[1] = jdf.config.htmlDir +'/index.html';

	var templateDir = path.resolve(__dirname,'../template/');

	for (var i =0 ; i<fileArray.length  ;  i++){
		if (!f.exists(fileArray[i])) f.write(fileArray[i], f.read(templateDir+'/'+fileArray[i]) );
	}
	console.log('jdf project directory init done!');
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


/**
 * @在当前文件下编译less/sass
 */
jdf.buildCss = function(){
	console.log('jdf buildCss ...');
	var currentDir = jdf.currentDir;
	BuildCss.init(currentDir, currentDir);

	var regStr = '\\.(less|sass|scss)$';
	var reg = new RegExp(regStr);
		
	Node_watch(currentDir, function(filename) {
		if(f.isFile(filename)){
			if(!reg.test(filename)) return;
		}
		
		console.log(filename.replace(currentDir, ''));
		BuildCss.init(currentDir, currentDir);
	});
}
