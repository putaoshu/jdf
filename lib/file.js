/**
* @文件操作 
*/

//原生组件
var path = require('path');
var fs = require('fs');
var util = require('util');
var Url = require('url');
var iconv = require('iconv-lite');
//var crypto = require('crypto');

//core function
var f = module.exports = {
	exists:fs.existsSync || path.existsSync,
	isFile : function(path){
		return this.exists(path) && fs.statSync(path).isFile();
	},
	isDir : function(path){
		return this.exists(path) && fs.statSync(path).isDirectory();
	},
	isBlankDir: function(path){
		return f.getdirlist(path).length == 0;
	},
	isWin : process.platform.indexOf('win') === 0,
	realpath : function(path){
		if(path && f.exists(path)){
			path = fs.realpathSync(path);
			if(this.isWin){
				path = path.replace(/\\/g, '/');
			}
			if(path !== '/'){
				path = path.replace(/\/$/, '');
			}
			return path;
		} else {
			return false;
		}
	},
	/**
	* @路径格式化 \ ==> /
	*/
	pathFormat:function(str){
		return str.replace(/\\/g,'\/');
	},
	currentDir:function(){
		return fs.realpathSync('.');
	},
	/**
	* @读文件
	* @update 
	*/
	read:function(path,encodeing){
		if (this.exists(path)){
			try {
				if(typeof(encodeing) != 'undefined' && encodeing == null){
					return fs.readFileSync(path);
				}else{
					var encodeing = encodeing || 'utf8';
					return fs.readFileSync(path, encodeing);
				}
			} catch (e) {
				console.log("jdf error [f.read]");
				console.log(path);
				console.log(e);
			}		
		}
	},
	/**
	* @写文件
	*/
	write:function(path,source,encodeing){
		try {
			var encodeing = encodeing || 'utf8';

			if(encodeing == 'gbk'){
				var s = iconv.decode(source, 'gbk');
    			source = iconv.encode(s, 'gbk');
    		}

			fs.writeFileSync(path , source, encodeing);
		} catch (e) {
			console.log("jdf error [f.write] " + path);
			console.log(e);
		}
	},
    /**
     * @copy二进制文件
     */
    copyBinary:function(srcFile, destFile){
    	var BUF_LENGTH = 64 * 1024;
		var _buff = new Buffer(BUF_LENGTH);
		
        try {
            var fdr = fs.openSync(srcFile, 'r')
            var stat = fs.fstatSync(fdr)
            var fdw = fs.openSync(destFile, 'w', stat.mode)
            var bytesRead = 1
            var pos = 0

            while (bytesRead > 0) {
                bytesRead = fs.readSync(fdr, _buff, 0, BUF_LENGTH, pos)
                fs.writeSync(fdw, _buff, 0, bytesRead)
                pos += bytesRead
            }

            fs.closeSync(fdr)
            fs.closeSync(fdw)
        } catch (e) {
            console.log("jdf error [f.copyBinary] " + srcFile);
            console.log(e);
        }
    },
	/**
	* @删除文件
	* @param source {String} 原始路径
	* @param callback {Function} 回调函数
	*/
	del:function(source,callback){
		var removedAll = true;
		var source = f.realpath(source);

		if(source){
			if(f.isDir(source)){
				var files;
				try {
					files = fs.readdirSync(source);
				} catch (err) {
					console.log(err);
				}
				
				files.forEach(function(name){
					if(name != '.' && name != '..') {
						removedAll = f.del(source + '/' + name) && removedAll;
					}
				});

				if(removedAll) {
					if(fs.existsSync(source)){
						fs.rmdirSync(source);	
					}
					
					if(callback) callback();
				}
			} else if(f.isFile(source)){
				if (f.isWin && f.exists(source)) {
					fs.chmodSync(source, 666);
				}
				fs.unlinkSync(source);
			} else {
				removedAll = false;
			}
		}

		return removedAll;
	},
	/**
	* @文件筛选
	* @param {String}  source  原始文件夹/文件路径
	* @param {String}  include  包括的文件后缀
	* @param {String}  exclude  不包括的文件后缀
	* @example f.filter(source, null, 'less|scss')
	*/
	filter:function(source, include, exclude){
		var filterTag = true;
		if (include) {
			var reg = new RegExp(include, 'gm');
			var regResult = reg.exec(source);
			if (!regResult) {
				filterTag = false;
			}
		}

		if (exclude) {
			var reg = new RegExp(exclude, 'gm');
			var regResult = reg.exec(source);
			if (regResult) {
				filterTag = false;
			}
		}

		return filterTag;
	},
	/**
	* @文件夹/文件复制不包括那些文件
	*/
	excludeFiles:function(filename){
		 return !(/.svn|Thumbs.db|.DS_Store/.test(filename));
	},
	/**
	* @文件夹/文件复制
	* @param source {String} 原始文件夹/文件路径
	* @param target {String} 目标文件夹/文件路径
	* @param uncover {Boole} false 覆盖
	* @param move {Boole} false 移动
	* @example f.copy(source,target,'include.js','exclude.css',false,false,false);
	*/
	copy:function(source, target, include, exclude, uncover, move , logTag, encoding){
		var removedAll = true;
		var source = f.realpath(source);

		if(source && f.filter(source, null, exclude)){
			if (!f.exists(target) && f.isDir(source)) {
				f.mkdir(target);
                //fs.chmodSync(target, 666);
			}
			
			if(f.isDir(source)){
				fs.readdirSync(source).forEach(function(name){
					if(name != '.' && name != '..' && f.excludeFiles(name)  ) {
						removedAll = f.copy(source + '/' + name,target + '/' + name, include, exclude, uncover, move , logTag ) && removedAll;
					}
				});

				//Bug  return binding.rmdir(pathModule._makeLong(path));
				//https://github.com/joyent/node/issues/3051
				//Yes, fs.rmdirSync throw an error, as you see. Because the directory still has a file even after fs.unlinkSync is called to remove the file.
				if(move && removedAll) {
					fs.rmdirSync(source);
				}
			} else if(f.isFile(source) && f.filter(source, include, exclude)){
				if(uncover && f.exists(target)){
					//uncover
					removedAll = false;
				} else {
					//中文会报错
					f.write(target,fs.readFileSync(source), encoding);
                    //f.copyBinary(source,target)
					if(move) {
						fs.unlinkSync(source);
					}
				}
			} else {
				removedAll = false;
			}
		} else {
			if (typeof(logTag) != 'undefined' && logTag) {
				console.log('jdf error : [ '+source+' ] --- no such file or dir');
			}
		}
		return removedAll;
	},
	/**
	* @下载文件
	* @param path 下载文件路径
	* @param target 目标文件名
	*/
	download:function(source,target,callback){
		var http = require('http');
		var fs = require('fs');

		var file = fs.createWriteStream(target);
		var request = http.get(source,function(response) {
			var status = response.statusCode;
			response.pipe(file);

			response.on('end',function(){
				if(status >= 200 && status < 300 || status === 304){
					if(callback) callback('ok');
				}
				
				if(status === 404){
					console.log('jdf download error '+source+ ' not exist.');
					if(callback) callback('error');
				}
			});

			response.on('error',function(err){
				 var msg = typeof err === 'object' ? err.message : err;
				 console.log(err);
			})
		});
	},
	tar:function(source,target,callback){
		//引用的组件
		var tar = require("tar");
		fs.createReadStream(source)
		.pipe(tar.Extract({ path:target }))
		.on("error",function (err) {
			console.error("jdf [file.tar] error "+source)
		})
		.on("end", function () {
			if(callback) callback();
		})
	},
  /**
  * @zip打包文件夹
  * @param sourcePath 源文件夹路径
  * @param zipPath 打包文件夹路径
  * @param zipName zip包名
  */
  zip: function(sourcePath, zipPath, zipName) {
    // require modules
    var archiver = require('archiver');

    // create a file to stream archive data to.
    var output = fs.createWriteStream(zipPath + '/' + zipName);

    var archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });

    // listen for all archive data to be written
    output.on('close', function() {
      // console.log(archive.pointer() + ' total bytes');
      console.log('zip success!');
    });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function(err) {
      if (err.code === 'ENOENT') {
        // log warning
      } else {
        // throw error
        throw err;
      }
    });

    // good practice to catch this error explicitly
    archive.on('error', function(err) {
      throw err;
    });

    // pipe archive data to the file
    archive.pipe(output);

    // append files from a sub-directory and naming it `new-subdir` within the archive
    archive.directory(sourcePath, false);

    // finalize the archive (ie we are done appending files but streams have to finish yet)
    archive.finalize();
  }
}

//同步mkdir
f.mkdir = function(p, mode, made) {
    if (mode === undefined) {
        mode = 0777 & (~process.umask());
    }
    if (!made) made = null;

    if (typeof mode === 'string') mode = parseInt(mode, 8);
    p = path.resolve(p);

	if ( !f.exists(p) ) {
		try {
			fs.mkdirSync(p, mode);
			made = made || p;
		}
		catch (err0) {
			switch (err0.code) {
				case 'ENOENT' :
					made = f.mkdir(path.dirname(p), mode, made);
					f.mkdir(p, mode, made);
					break;
				default:
					var stat;
					try {
						stat = fs.statSync(p);
					}
					catch (err1) {
						throw err0;
					}
					if (!stat.isDirectory()) throw err0;
					break;
			}
		}
		return made;
	}
};

/**
* @递归读取文件列表
* @2014-4-17 17:16:14
*/
f.getdirlist = function(source, include, exclude){
	var _this = this;
	var result = [];
	//var source = f.realpath(source);
	if(source){
		if(f.isDir(source)){
			fs.readdirSync(source).forEach(function(name){
				result = result.concat( _this.getdirlist(source + '/' + name, include, exclude) );
			});
		} else if(f.isFile(source) && f.filter(source, include, exclude)){
			result.push(source.replace("//","/"));
		}
	}
	return result;
}

/**
 * @readJSON
 */
f.readJSON = function(url, callback){
	var res = null;
	if (f.exists(url)) {
		try{
			var data = f.read(url);
			if (data) {
				data = JSON.parse(data);
				res = data;
			}
			if(callback) callback(res);
		}catch(e){
			console.log('jdf error [f.readJSON] "'+url+'" format error' );
			console.log(e);
			//if(callback) callback(res);
		}
	}else{
		console.log('jdf error [f.readJSON] "'+url+'" is not exists' );
		//if(callback) callback(res);
	}
}

f.moveFolderAsync=function(source,target){
    var fork = require('child_process').fork;
    var childPath=__dirname+"/fileWorker.js";
    childPath=path.normalize(childPath);

    var subProc =  fork(childPath);
    subProc.on('message', function(data) {
        this.disconnect();
    });

    subProc.send({
        source:source,
        target:target,
        route:'copy'
    });
}

f.delAsync=function(target){
    var fork = require('child_process').fork;
    var childPath=__dirname+"/fileWorker.js";
    childPath=path.normalize(childPath);

    var subProc =  fork(childPath);
    subProc.on('message', function(data) {
        this.disconnect();
    });

    subProc.send({
        target:target,
        route:'del'
    });
}

f.renameFile=function(path,dest){
	fs.renameSync(path,dest);
}

f.base64Encode = function(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}
