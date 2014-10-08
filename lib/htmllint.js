/**
 * @htmllint
 * @ctime 2014-10-8
 * @wiki https://github.com/htmllint/htmllint
 */

var htmllint = require('htmllint');
var f = require('./file');
var $ = require('./base');

function htmllintInit(fileName, fileContent){
	var content = '';

	if(typeof(fileContent) == 'undefined'){
		content = f.read(fileName);
	}else{
		content = fileContent;
	}

	console.log(htmllint(content));
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
	    }else if(f.isFile(fileName) && $.is.html(fileName)){
	       htmllintInit(fileName);
	    }else{
	    	console.log('jdf htmllint ' + fileName + ' is not exists');
	    }
	}else{
		htmllintInit(fileName, fileContent);
	}
}
