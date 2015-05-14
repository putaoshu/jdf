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
	var arr = str.match(/^(<!--){0}\s*#parse\([\"|\'](.*?)[\"|\']\)(\s\n\r)*(-->){0}/gmi);
	var res = {
		vm:[],
		tpl:[],
		js:[],
		css:[]
	};
	
	if (arr) {
		for (var i =0  ; i<arr.length  ; i++ ){
			var temp = arr[i].match(/#parse\([\"|\'](.*?)[\"|\']\)/);
			if(temp){
				var basename = temp[1];
				if (basename) {
					var source  = dirname + basename;
					source = path.normalize(source);

					var dirname1 = path.dirname(source);
					var dirlist1 = f.getdirlist(dirname1);
					
					dirlist1.forEach(function(item){
						var item = item.replace(jdf.currentDir, '');
						item = item.replace(/\\/g,'/');
						
						if($.is.vm(item)){
							res.vm.push(item);
						}

						if($.is.tpl(item)){
							res.tpl.push(item);
						}

						if($.is.css(item)||$.is.less(item)||$.is.sass(item)){
							res.css.push($.getCssExtname(item));
						}

						if($.is.js(item)){
							res.js.push(item);
						}
					});

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

	return {
		content:str,
		url:res
	};
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
		return {
			content:Velocity.render(vmTpm.content, dataObj),
			url:vmTpm.url
		};
	}
}