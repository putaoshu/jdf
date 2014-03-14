/**
* @ftp (upload files to remote server)
* @time 2014-2-26 10:46:32
*/
var path = require('path');
var fs = require('fs');

//依赖lib
var f = require('./file.js');
var jdf = require('./jdf.js');

//exports
var ftp = module.exports;
var FTP = require('ftp');
//挂在ftp下面,供内部和外部调用
ftp.client = new FTP();

/**
* @取配置信息
* @config.json相关格式如下

	{
		"host":"192.168.1.1",
		"user":"*",
		"password":"*"
	}

*/
var options = {};
options.port = jdf.config.port || 21;
options.host = jdf.config.host || null;
options.user = jdf.config.user || null;
options.password = jdf.config.password || null;

//建立链接
ftp.client.connect(options);

/**
* @上传文件夹/文件
* @param {String} source 原始文件夹/文件路径
* @param {String} target 远端机器目标文件夹/文件路径
* @param {Boole} uncover false
* @param {Boole} move false 移动
* @example ftp.upload('../test','test', null, null, false, false, false, function(){});
*/
ftp.upload = function(source, target, include, exclude, uncover, move , logTag, callback){
	//打开进程
	ftp.client.on('ready', function(err) {
		ftp.uploadMain(source, target, include, exclude, uncover, move , logTag, callback);
	}).on('error',function(err){
		console.log('jdf error [ftp.upload] - ' + err);
	});
}

//上传本地和服务器端计数
var uploadLocalNum = 0;
var uploadRemoteNum = 0;

/**
* @上传递归函数
*/
ftp.uploadMain = function(source, target, include, exclude, uncover, move , logTag, callback){
	var removedAll = true;
	var source = f.realpath(source);
	if(source){
		var core = function(){
			if(f.isDir(source)){
				ftp.client.mkdir(target , false, function(){});

				fs.readdirSync(source).forEach(function(name){
					if(name != '.' && name != '..' && !(/.svn/.test(name)) ) {
						removedAll = ftp.uploadMain(source + '/' + name,target + '/' + name, include, exclude, uncover, move , logTag, callback ) && removedAll;
					}
				});

				if(move && removedAll) {
					fs.rmdirSync(source);
				}	
			} else if(f.isFile(source) && f.filter(source, include, exclude)){
				uploadLocalNum += 1;
				
				if(uncover /*&& f.exists(target)*/){
					//uncover
					removedAll = false;
				} else {
					ftp.put(source, target, function(err) {
						uploadRemoteNum += 1;

						if (uploadLocalNum == uploadRemoteNum) {
							if(callback) callback(err);
							//关闭进程
							ftp.client.end();
						}
					  	
					});

					if(move) {
						fs.unlinkSync(source);
					}
				}
			} else {
				removedAll = false;
			}
		}
		core();
	} else {
		if (typeof(logTag) != 'undefined' && !logTag) {
			return;
		}
		console.log('[ '+source+' ] --- no such file or dir');
	}
	return removedAll;
}

/**
* @put
*/
ftp.put = function(source, target, callback){
	ftp.client.put(source, target, function(err) {
		if (err){
			console.log('jdf error [ftp.put] - '+ target+' - ' + err);
			if (callback) callback(err);
			ftp.client.end();
		}else {
			if (callback) callback();
		}
	});
}

/**
* @get server files list
*/
ftp.list = function(source, callback){
	if(typeof(source) == 'undefined'){
		var source = './';
	}

	ftp.client.on('ready',function(){
		ftp.client.list(source, function(err, list) {
			if (err){
				console.log('jdf error [ftp.list] - ' + err);
				ftp.client.end();
			}else {
				console.dir(list);
				if (callback) callback(list);
				ftp.client.end();
			}
		});
	})
}

/**
* @get server files list
*/
ftp.mkdir = function(source, callback){
	if(typeof(source) == 'undefined'){
		console.log('jdf error [ftp.mkdir] source is not exists');
		return;
	}

	ftp.client.on('ready',function(){
		ftp.client.mkdir(source , false, function(err){
			if(callback) callback(err);
		});
	})
}
