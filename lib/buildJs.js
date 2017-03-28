var f = require("./file.js");
var jdf = require("./jdf.js");
var babelCore = require('babel-core');

var path = require('path');
var $ = require('./base.js');

/**
 * @build js
 * @time 2016-11-7
 * @param src 输入文件/文件夹相对路径
 * @param dist 输出文件/文件夹相对路径
 * @doc http://babeljs.io/docs/usage/api/
 */

exports.init = function(src, dist){
	if(f.isDir(src)){
       var filelist = f.getdirlist(src,'(js)$',jdf.config.build.isEs6Exclude);
        filelist.forEach(function(item){
            babel(item, dist);
        })
    }else if(f.isFile(src)){
       babel(src, dist);
    }else{
    	console.log('jdf buildJs "' + src + '"" is not exists');
    }
}

var babel = function(src, dist){
	
    //http://babeljs.io/docs/usage/api/#options
    //https://github.com/babel/babel/tree/master/packages/babel-preset-es2015
    
    var options = {
		presets: [
            require('babel-preset-es2015')
            // require('babel-preset-es2015-without-strict')
			,require('babel-preset-stage-1')
		]
	}

	try {
		var dist = path.normalize(dist +'/'+ src);
		var src = path.normalize(jdf.currentDir +'/'+ src);
        
        if(jdf.config.build.hasCmdLog) console.log('buildES6js---'+ src);
		
        var result = babelCore.transformFileSync(src, options);
		f.write(dist, result.code);

    } catch (e) {
        console.log('jdf error [jdf.buildJS.ES6] - ' + src);
        console.log(e);
    }
}