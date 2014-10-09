/**
 * @htmllint
 * @ctime 2014-10-8
 * @wiki https://github.com/htmllint/htmllint
 */

var os = require('os');
var htmllint = require('htmllint');
var colors = require('colors');
var f = require('./file');
var $ = require('./base');

function htmllintInit(fileName, fileContent){
	if($.is.httpLink(fileName)){
		$.httpget(fileName, function(data){
			output(data);
		});
	}else if(typeof(fileContent) == 'undefined'){
		output(f.read(fileName));
	}else{
		console.log(fileContent);
	}

	function output(data){
		console.log(os.EOL + 'jdf htmllint: ', fileName);
		htmllint(data).forEach(function(item, index){
			console.log('#' + (index+1));
			console.log(colors.red('>>'), 'line: ' + item.line + ', column: ' + item.column);
			console.log(colors.red('>>'), 'msg: ' + item.msg)
		});
	}
}

/**
 * @init
 * @param {String} filename 文件名称
 * @param {String} fileContent 文件内容
 */
exports.init = function(fileName, fileContent){
	if(typeof(fileContent) == 'undefined'){
		if(f.isDir(fileName)){
	        var filelist = f.getdirlist(fileName, '(html|htm)$');
	        filelist.forEach(function(item){
	            htmllintInit(item);
	        })
	    }else if((f.isFile(fileName) && $.is.html(fileName)) || $.is.httpLink(fileName)){
	       htmllintInit(fileName);
	    }else{
	    	console.log('jdf htmllint ' + fileName + ' is not exists');
	    }
	}else{
		htmllintInit(fileName, fileContent);
	}
}
