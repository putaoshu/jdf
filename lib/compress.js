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
* @param {String} rSource 文件/文件夹绝对路径
* @param {Boolse} isdebug debug模式true时不压缩代码,仅处理路径
*/
compress.init = function(rSource, isdebug){
	var isdebug = false || isdebug;

	var allTag = true;
	var source = f.realpath(rSource);
	if(source){
		if(f.isDir(source)){
			fs.readdirSync(source).forEach(function(name){
				if(name != '.' && name != '..' && !(/.svn/.test(name)) ) {
					allTag = compress.init(source + '/' + name, isdebug) && allTag;
				}
			});
		} else if(f.isFile(source)){

			//js UglifyJS
			if ($.is.js(source)) {
				var sourceCode =  compress.js(source, isdebug);
				f.write(source, sourceCode)
			}
			
			//css CleanCSS
			if ($.is.css(source)) {
				var sourceCode = compress.css(source, isdebug);
				f.write(source, sourceCode);
			}

			//png
			if ($.is.png(source) && isdebug) {
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
* @param rSource 文件名
* @param source 文件内容
* 
*	 var a=require('a.js') ==> var a=require('projectPath/a.js')
*
*	 define('/a.js',function(require, exports) {});  ==>
*	 define('projectPath/a.js', ['projectPath/b.js'], function(require, exports) {});
*
*  define(function(require, exports)) ==> 
*	define('projectPath/a.js',['projectPath/b.js'],function(require, exports))
*
*	seajs.use(['/a.js', '/b.js'],function(){}) ==> 
*	seajs.use(['projectPath/a.js', 'projectPath/b.js'],function(){})
* 
*/
compress.addJsDepends = function(rSource, sourceCompress, sourceOrigin, isdebug){
	var source = sourceCompress;
	if ( isdebug ){
		source = sourceOrigin;
	}
	
	var configBaseDir = jdf.config.baseDir ? jdf.config.baseDir+'/'  : '';

	var dependenceArray = [];
	var arr = sourceCompress.match(/require\("(.*?)"\)/gmi);

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
					match = match.replace(configBaseDir, '');
					match = jdf.getProjectPath()+match;
				}

				//source content require add prefix
				//var a=require('a.js') ==> var a=require('projectPath/a.js')
				source = source.replace(temp[1], match);
				dependenceArray.push('"' + match + '"');
			}
		}
	}
	dependenceArray = dependenceArray.join(',');

	/**
	* @has file id add dependenceArray
	* @example
	*	 define('/a.js',function(require, exports) {});  ==>
	*	 define('projectPath/a.js', ['projectPath/b.js'], function(require, exports) {});
	*/
	if (dependenceArray.length>0) {
		//insert .*?
		var arrTemp = /(define\(["|'].*?["|']).*?function/gm.exec(source);
		var strTemp = arrTemp ? arrTemp[1] : null;
		
		if(strTemp){
			source = source.replace(strTemp, strTemp+','+'['+dependenceArray+']');
		}
	}
	
	/**
	* @add files id and dependenceArray
	* @example  
	*  define(function(require, exports)) ==> 
	*  define('projectPath/a.js',['projectPath/b.js'],function(require, exports))
	*/
	if ( /define\(function/gm.exec(sourceCompress) ) {
		//getProjectPath
		var filepath = rSource.split(jdf.config.outputDirName+'/'+jdf.getProjectPath());
		
		var filename = null;
		if (filepath && filepath.length>1) {
			filename = filepath[1].replace(configBaseDir, '');
			var getProjectPath = jdf.getProjectPath() ? jdf.getProjectPath()+'/'  : '';
			filename = getProjectPath+filename;
		};

		if (!filename) {
			filename = path.basename(rSource);
		}

		//del // prefix
		filename = filename.replace(/\/\//g, '/');
		if (dependenceArray.length==0) {
			dependenceArray = '';
		}
		source = source.replace('define(function','define("'+filename+'",['+dependenceArray+'],function');
	}

	/**
	* @seajs.use add prefix 
	* @example  
	*	seajs.use(['/a.js', '/b.js'],function(){}) ==> 
	*	seajs.use(['projectPath/a.js', 'projectPath/b.js'],function(){})
	*/
	var hasSeajs = sourceCompress.match(/seajs\.use\((.*?),function/gim);
	if (hasSeajs) {
		//去重obj
		var tempObj = {};

		for (var i =0, j= hasSeajs.length; i<j; i++){
			var  t= hasSeajs[i].replace(/seajs.use\(|\[|\]|,function/gim, '');
			var t1 = t.split(',');
			if (t1) {
				for (var m=0; m<t1.length; m++ ){
					//get origin source
					var t2 = t1[m].replace(/\"/g, '').replace(/\'/g, '');
					if (/^\//.test(t2)) {
						//add prefix here
						var t3 = jdf.getProjectPath() + t2.replace(configBaseDir, '');
						tempObj[t2] = t3;
						
					}
				}
			}
		}
		
		for (var i in  tempObj ){
			var reg = new RegExp(i, 'gim');
			//replace source
			source = source.replace(reg, tempObj[i]);
		}
	}

	return source;
};

/**
* @增加前缀banner
* @return {String} /* projectPath - Date:2014-03-13 13:06:12:120 * /
*/
compress.setPrefixBanner = function(basename){
	var projectPath = jdf.getProjectPath() ? jdf.getProjectPath().replace('/','-')+' '  : '';
	var basename = typeof(basename) == 'undefined' ? '' : basename+' ';
	 return '/* '+projectPath + basename +'Date:'+$.getDay('-')+' '+$.getTime(':', false)+' */\r\n';
}

/**
* @js文件压缩
* @param source 文件/文件夹路径
* @return compress code
*/
compress.js = function(source, isdebug){
	var isdebug = false || isdebug;
	if (!f.exists(source)) {return;}
	var sourceContent = f.read(source);
	//sourceContent = compress.addJsDepends(sourceContent);

	var options = {
		except: ['require','define'],
		ascii_only: true,
		beautify: false//美化代码
		//,mangle: false//是否压缩 失效的参数
	};

	var result = sourceContent;

	try {
		//if (!isdebug){
			//parse
			UglifyJS.base54.reset();
			var toplevel = UglifyJS.parse(sourceContent);
			toplevel.figure_out_scope();
			var compressorOption = {
				//fromString: true,	//说明代码源的格式是否为字符串
				//mangle: true,			//是否压缩,只要配置就不压缩了
				warnings: false			//显示压缩报错
			}
			var compressor = UglifyJS.Compressor(compressorOption);
			toplevel = toplevel.transform(compressor);
			toplevel.mangle_names({except:options.except});

			//output, has /*$ */ comments
			var stream = UglifyJS.OutputStream({
				comments: function(scope, comment){
					if ( isdebug ){
						return true;
					}else{
						if(comment.type == 'comment2' && comment.value.charAt(0) === '$' && options.copyright){
							return comment;
						}
						return false;
					}
				},
				space_colon : false,
				quote_keys: true,
				beautify: options.beautify,
				ascii_only: options.ascii_only
			});

			toplevel.print(stream);
			result = stream.get();
		//}

		result = compress.addJsDepends(source, result, sourceContent, isdebug);
		//增加前缀banner
		if(jdf.config.hasBanner && !isdebug){
			result = compress.setPrefixBanner( path.basename(source) ) + result + '\r\n';
		}
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
compress.css = function(source, isdebug){
	var isdebug = false || isdebug;

	if (!f.exists(source)) {return;}
	var sourceCode = f.read(source);
	var result = sourceCode;
	if ( !isdebug ){
		result = new CleanCSS({
			keepBreaks:false,//是否有空格
			processImport:false//是否替换@import
		}).minify(sourceCode);
	}
	
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

	//增加域名前缀
	var prefix =  jdf.config.cdn + sourcedir.replace(outputdir , '') +'/';
	prefix = prefix.replace(/\\/g, '/');
	result = compress.cssImagesUrlReplace(result, prefix);
	
	//增加前缀banner
	if(jdf.config.hasBanner && !isdebug) {
		result = compress.setPrefixBanner( path.basename(source) ) + result + '\r\n';
	}
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
