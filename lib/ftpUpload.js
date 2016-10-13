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
exports.init = function(dir, options, hasConfig, haslog, callback){
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
		jdf.output(dir, options, function(){
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
	if (options.watch) {
		//watch upload
		outputFnOnce();
		Node_watch(f.currentDir(), function(filename) {
			console.log(filename);
			outputFnWatch();
		});
	}else if (options.custom) {
		//custom upload	
		if (f.exists(options.from)) {
		    //如果没有指定远程路径，就设置远程路径和本地路径相同
			options.to = options.to || options.from;
			console.log('jdf uploading');
			jdf.dot.begin();
			ftpFn(options.from, options.to);
		} else{
			console.log('jdf warning [jdf.upload] - "' + options.from + '" not exists');
		};
	} else if(options.preview && jdf.config.previewServerDir) {
		//preview
        options.preview = jdf.config.buildDirName;

		jdf.output(dir, options, function() {
			ftpFn(uploadSource, jdf.config.previewServerDir);
		});
	} else if (options.nc && jdf.config.newcdn ) {
		jdf.config.cdn = jdf.config.newcdn;
		outputFnOnce();
	} else if (options.nh && jdf.config.newcdn) {
		//newcdn html
		options.nh = jdf.config.buildDirName;
		//内链link src替换
		jdf.config.cdnDefalut = jdf.config.cdn;
		jdf.config.cdn = jdf.config.newcdn;
		jdf.output(dir, options, function(){
			ftpFn(uploadSource, jdf.config.previewServerDir);
		});
	} else if (options.list && jdf.config.uploadList) {
		// 根据config.json配置上传
		options.list = jdf.config.uploadList;
		jdf.output(dir, options, function() {
			ftpFn(uploadSource, uploadTarget);
		});
	} else {
		//default upload
		outputFnOnce();
	}
}