/**
 * @upload 2014-12-5
 */

var path = require('path');

//依赖lib
var f = require('./file.js');
var jdf = require('./jdf.js');

/**
* @upload init
* @time 2014-2-26 19:17:39 / 2014-12-5
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
exports.init = function(argv, hasConfig, haslog, callback){
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
	}else if((
				argv[3]=='-preview' || argv[3]=='-p' || argv[4]=='-preview' || argv[4]=='-p'
			) && jdf.config.previewServerDir){
		//preview
		if(argv[3] == '-preview' || argv[3] == '-p'){
			argv[3] = jdf.config.buildDirName;
		}
		
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