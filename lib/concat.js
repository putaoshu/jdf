/**
 * @files concat
 * @ctime 2014-9-24
 */

var path = require('path');
var fs = require('fs');

//lib自身组件
var $ = require('./base.js');
var f = require('./file.js');
var jdf = require('./jdf.js');

//exports
var concat = module.exports = {};

concat.init = function(rSource){
	var concatFiles = jdf.config.output.concat;

	Object.size = function(obj) {
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	};
	var source = f.realpath(rSource)+'/'+jdf.getProjectPath();
	
	if ( Object.size(concatFiles)) {
		for (var i in concatFiles  ){
			var res = '';
			concatFiles[i].forEach(function(j){
				var m = $.getCssExtname(source+'/'+j);
				if (f.exists(m)) {
					res += f.read(m);
					//f.del(source+'/'+j);
				}else {
					console.log('jdf warnning "'+j+'" is not exists');
				}
			});
			if (res != '') {
				f.write(source+'/'+i, res);
			}
		}
	}
}