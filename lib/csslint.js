/**
 * @csslint
 * @ctime 2014-7-11
 * @wiki https://github.com/CSSLint/csslint/wiki/Command-line-interface
 */

var csslint = require('csslint').CSSLint;

var f = require('./file.js');
var $ = require('./base.js');
var colors = require('colors');
var os = require('os');

function csslintInit(filename, fileContent){
	var content = '';
	if(typeof(fileContent) == 'undefined'){
		content = f.read(filename);
	}else{
		content = fileContent;
	}

	var result = csslint.verify(content);
		
	if(result && result.messages.length){
		var n = 0;
		var messagesType = function (type){
			 return type == 'error' || type == 'warning';
		}
		result.messages.forEach(function (message, i){
			var type = message.type;
			if(messagesType(type)){
				n += 1;
			}
		});

		console.log(os.EOL + 'jdf csslint: ' + filename);

		result.messages.forEach(function (message, index){
			var type = message.type;

			if(messagesType(type)){
				console.log('#'+(index+1));
                console.log(colors.red('> '), 'line: ' + message.line + ', column: ' + message.col);
                console.log(colors.red('> '), 'msg: ' + message.message);
                console.log(colors.red('> '), 'at: ' + message.evidence);
            }
		});

	}else{
		console.log('jdf csslint: ' + filename + ' is ok' );
	}
}

/**
 * @init
 * @param {String} filename 文件名称
 * @param {String} fileContent 文件内容
 */

exports.init = function(filename, fileContent){
	if(typeof(fileContent) == 'undefined'){
		if(f.isDir(filename)){
	        var filelist = f.getdirlist(filename, '(css|scss|less)$');
	        filelist.forEach(function(item){
	            csslintInit(item);
	        })
	    }else if(f.isFile(filename) && ($.is.css(filename) || $.is.less(filename) || $.is.sass(filename) ) ){
	       csslintInit(filename);
	    }else{
	    	console.log('jdf csslint ' + filename + ' is not exists');
	    }
	}else{
		csslintInit(filename, fileContent);
	}
}