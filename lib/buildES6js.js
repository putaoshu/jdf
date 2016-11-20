var f = require("./file.js");
var jdf = require("./jdf.js");
var babelCore = require('babel-core');

var path = require('path');
var $ = require('./base.js');

var es2015 = require('babel-preset-es2015');
var stage_1 = require('babel-preset-stage-1');

/**
 * @build js
 * @time 2016-11-7
 * @param src 输入文件/文件夹相对路径
 * @param dist 输出文件/文件夹相对路径
 * @doc http://babeljs.io/docs/usage/api/
 */

exports.init = function(src, dist){
	if(f.isDir(src)){
       var filelist = f.getdirlist(src,'(js)$');
        filelist.forEach(function(item){
            babel(item, dist);
        })
    }else if(f.isFile(src)){
       babel(src, dist);
    }else{
    	console.log('jdf csslint ' + src + ' is not exists');
    }
}

var babel = function(src, dist){
	var options = {
		presets: [
			es2015,
			// "react", 
			stage_1
		]
	}

	try {
		var dist = path.normalize(dist +'/'+ src);
		var src = path.normalize(jdf.currentDir +'/'+ src);
		
        var result = babelCore.transformFileSync(src, options);
		f.write(dist, result.code);

    } catch (e) {
        console.log('jdf error [jdf.buildJS.ES6] - ' + src);
        console.log(e);
    }
}