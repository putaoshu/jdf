var path = require('path');
var fs = require('fs');

//lib自身组件
var $ = require('./base.js');
var f = require('./file.js');
var jdf = require('./jdf.js');

//外部组件
var UglifyJS = require("uglify-js");
var CleanCSS = require('clean-css');
// var Pngcrush = require('node-pngcrush');
var Pngquant = require('node-pngquant-native');

//exports
var compress = module.exports = {};

/**
* @文件压缩初始化
* @time 2014-2-14 16:19:18
* @param src 输入文件/文件夹相对路径,无dest默认compress src
* @param dest 输出文件/文件夹相对路径
*/
compress.dir = function (src,dest){
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

	compress.init(destPath);

	//console.log('jdf compress success!');
}

/**
* @文件/文件夹压缩
* @param rSource 文件/文件夹绝对路径
*/
compress.init = function(rSource){
	var allTag = true;
	var source = f.realpath(rSource);
	if(source){
		if(f.isDir(source)){
			fs.readdirSync(source).forEach(function(name){
				if(name != '.' && name != '..' && !(/.svn/.test(name)) ) {
					allTag = compress.init(source + '/' + name) && allTag;
				}
			});
		} else if(f.isFile(source)){

			//js UglifyJS
			if ($.is.js(source)) {
				var sourceCode =  compress.js(source);
				f.write(source, sourceCode)
			}
			
			//css CleanCSS
			if ($.is.css(source)) {
				var sourceCode = compress.css(source);
				f.write(source, sourceCode);
			}

			//png
			if ($.is.png(source)) {
				compress.png(source, source);
				//f.write(source, sourceCode);
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
* @param source 文件内容
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
compress.addJsDepends = function(rSource, source){
	//get dependenceArray
	var dependenceArray = [];
	var arr = source.match(/require\("(.*?)"\)/gmi);
	if (arr) {
		for (var i =0  ; i<arr.length  ; i++ ){
			var temp = arr[i].match(/require\("(.*?)"\)/);
			if(temp){
				var match = temp[1];
				//无.js缀和不含有.css的url加.js
				if (! (/\.js$/i.test(match)) && !/\.css/i.test(match)) {
					match += '.js';
				}
				//add prefix
				if( /^\//.test(match) ) {
					match = match.replace(jdf.config.baseDir+'/', '');
					match = jdf.getProjectPath()+match;
				} 

				dependenceArray.push('"' + match + '"');
			}
		}
	}
	dependenceArray = dependenceArray.join(',');
	
	if (dependenceArray.length>0) {
		//insert
		var arrTemp = /(define\(".*?").*?function/gm.exec(source);
		var strTemp = arrTemp ? arrTemp[1] : null;
		
		if(strTemp){
			source = source.replace(strTemp, strTemp+','+'['+dependenceArray+']');
		}else if ( /define\(function/gm.exec(source) ) {
			//取得文件路
			var filepath = rSource.split(jdf.config.outputDirName+'/'+jdf.getProjectPath());
			// console.log(t);
			if (filepath && filepath.length>1) {
				var filename = filepath[1].replace(jdf.config.baseDir+'/', '');
				filename = jdf.getProjectPath()+filename;
			};
			source = source.replace('define(function','define(["'+filename+'"],['+dependenceArray+'],function');
		}
	}
	return source;
};


/**
* @js文件压缩
* @param source 文件/文件夹路径
* @return compress code
*/
compress.js = function(source){
	if (!f.exists(source)) {return;}
	var sourceContent = f.read(source);
	//sourceContent = compress.addJsDepends(sourceContent);

	var options = {
		except: ['require','define'],
		ascii_only: true,
		copyright: true
	};
	
	var result = '';

	try {
		//parse
		UglifyJS.base54.reset();
		var toplevel = UglifyJS.parse(sourceContent);
		toplevel.figure_out_scope();
		toplevel.mangle_names({except:options.except});

		//output, has /*$ */ comments
		var stream = UglifyJS.OutputStream({
			comments: function(scope, comment){
				if(comment.type == 'comment2' && 
					comment.value.charAt(0) === '$' 
					&& options.copyright)
				{
					return comment;
				}
				return false;
			},
			ascii_only : options.ascii_only
		});

		toplevel.print(stream);
		result += stream;
		result = compress.addJsDepends(source, result);
		result = '/* '+jdf.getProjectPath()+' - Date: '+$.getDay('-')+' */\r\n' + result;
	}catch (e) {
		if (e && e.message) {
			console.log('jdf error [compress.js] - '+source +' , line:'+e.line +', ' +e.message );
		}
	}
	return result;
};


/**
* @css文件压缩
* @param source 文件/文件夹路径
* @return compress code
*/
compress.css = function(source){
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
	result = compress.cssImagesUrlReplace(result, prefix);
	return result;
};

/**
* css中图片路径替换
* @time 2014-2-21 10:17:13
* @param prefix 前缀
* @param suffix 后缀
* @example 
	cssImagesUrlReplace('.test{background-image:url("i/test.jpg");}','http://cdn.com/','?time=123') ===> 
	.test{background-image:url("http://cdn.com/i/test.jpg?time=123");}
*/
compress.cssImagesUrlReplace = function (str,prefix,suffix) {
     var prefix = prefix || '';
     var suffix = suffix || '';
     var cssImagesUrlReg = new RegExp("url\\(.*?\\)","igm");
     var temp = str.match(cssImagesUrlReg);

     if (temp) {
			var tempObj = {};
			//去重
			 for (var i = temp.length - 1; i >= 0; i--) {
				if ($.is.imageFile(temp[i])) {
					tempObj[temp[i]] = 1;
				}
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
@method	Pngquant优化png图片
@option {String} source 输入文件路径
@option {String} target 输出文件路径
@option {Function} callback 回调函数
@option {Boolse} false 是否显示log
**/
compress.png = function(source, target, callback, haslog){
    fs.readFile(source, function (err, buffer) {
		if (err){
			return callback(err);
		}
      
      	var options = {};
		if(typeof(haslog) != 'undefined'){
			options.params = '-v --iebug';
		}
		
		buffer = Pngquant.option(options).compress(buffer);

		fs.writeFile(target, buffer, {
			flags: 'wb'
		}, callback);
    });
};
