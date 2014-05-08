/**
 * @vm
 */
var path = require('path');
var fs = require('fs');
var util = require('util');

var $ = require('./base.js');
var f = require('./file.js');
var jdf = require("./jdf.js");

var Velocity = require('velocityjs');

//exports
var vm = module.exports;

/**
 * @velocityjs extend
 * @{String} str 数据内容
 * @{String} dirname 文件的dirname
 */
vm.parse = function(str, dirname){
	var dirname = typeof dirname == 'undefined' ? '' : dirname;
	var arr = str.match(/#parse\([\"|\'](.*?)[\"|\']\)/gmi);
	//console.log(arr);
	if (arr) {
		for (var i =0  ; i<arr.length  ; i++ ){
			var temp = arr[i].match(/#parse\([\"|\'](.*?)[\"|\']\)/);
			if(temp){
				//console.log(temp);
				var basename = temp[1];
				if (basename) {
					var source  = dirname + basename;
					if (f.exists(source)) {
						var content = f.read(source);
						if (content) {
							//替换
							str = str.replace(temp[0], content);
						}
					}
				}
			}
		}
	}
	return str;
 }

/**
 * @rander data
 * @{String} vmSource vm内容
 * @{Object} dataObj vm对应的数据
 * @{String} dirname vm的dirname
 */
vm.rander = function(vmSource, dataObj, dirname){
	if (vmSource && dataObj) {
		var vmTpm = vm.parse(vmSource, dirname);
		return Velocity.render(vmTpm, dataObj);
	}
}