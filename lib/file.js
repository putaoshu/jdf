/**
* @文件操作 
*/

//原生组件
var path = require('path');
var pth = require('path');
var fs = require('fs');
var util = require('util');
var Url = require('url');
//var crypto = require('crypto');


//core function
var f = module.exports = {
	exists:fs.existsSync || pth.existsSync,
	isFile : function(path){
		return this.exists(path) && fs.statSync(path).isFile();
	},
	isDir : function(path){
		return this.exists(path) && fs.statSync(path).isDirectory();
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
			var encodeing = encodeing || 'utf8';
			return fs.readFileSync(path,encodeing);
		}
	},
	/**
	* @写文件
	*/
	write:function(path,source,encodeing){
		var encodeing = encodeing || 'utf8';
		fs.writeFileSync(path , source, encodeing);
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
				fs.readdirSync(source).forEach(function(name){
					if(name != '.' && name != '..') {
						removedAll = f.del(source + '/' + name) && removedAll;
					}
				});
				if(removedAll) {
					fs.rmdirSync(source);
					if (callback) {
						callback();
					}
				}
			} else if(f.isFile(source)){
				fs.unlinkSync(source);
			} else {
				removedAll = false;
			}
		} else {
			//
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
			var reg = new RegExp(include+'$', 'gm');
			var regResult = reg.exec(source);
			if (!regResult) {
				filterTag = false;
			}
		}

		if (exclude) {
			var reg = new RegExp(exclude+'$', 'gm');
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
	copyExcludeFiles:function(filename){
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
	copy:function(source, target, include, exclude, uncover, move , logTag ){
		var removedAll = true;
		var source = f.realpath(source);
		if(source){
			if (!f.exists(target) && f.isDir(source)) {
				f.mkdir(target);
			}
			
			if(f.isDir(source)){
				fs.readdirSync(source).forEach(function(name){
					if(name != '.' && name != '..' && f.copyExcludeFiles(name)  ) {
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
					f.write(target,fs.readFileSync(source));
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
			console.error("error here")
		})
		.on("end", function () {
			if(callback) callback();
		})
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
* @递归读取文件 by wangshaoxing
*/
f.walkInto = function(dir, back) {
    var result = [];
    fs.readdirSync(dir, function(err, files) {
        if (err) back(err);
        files = files.filter(function(value) {
            return (value[0] != '.');
        });

        var pending = files.length;
        if (!pending) {
            return back(null, result)
        };

        files.forEach(function(file) {
            fs.stat(dir + '/' + file, function(err, stats) {
                if (stats.isFile()) {
                    result.push(dir + '/' + file);
                    if (!--pending) back(null, result);
                }
                if (stats.isDirectory()) {
                    f.walkInto(dir + '/' + file, function(err, res) {
                        result = result.concat(res);
                        if (!--pending) back(null, result);
                    })
                }
            });
        });
    });
}

/**
* @readJSON
*/
f.readJSON = function(path){
	var json = f.read(path);
	var result = {};
	try {
		result = JSON.parse(json);
	} catch(e) {
		console.log('parse json file[' + path + '] fail, error [' + e.message + ']');
	}
	return result;
}