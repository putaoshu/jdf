/**
 * @filellint
 * @ctime 2014-10-8
 */

var os = require('os');
var Htmllint = require('htmllint');
var Csslint = require('csslint').CSSLint;
var Jslint = require('atropa-jslint');
var colors = require('colors');
var f = require('./file');
var $ = require('./base');

/**
 * @init
 * @param {String} filename 文件名称
 */
exports.init = function(filename){
	if(!typeof(filename) !== 'undefined'){
		if(f.isDir(filename)){
			var filelist = f.getdirlist(filename, '(html|vm|tpl|css|scss|less|js)$');

			filelist.forEach(function(file){
				route(file);
			});

		}else{
			route(filename);
		}
	}

	function route(file){
		var exists = f.exists(file);

		if($.is.httpLink(file)){
			httpLinkLint(file);
			return;
		}

		if(exists){
			if($.is.html(file) || $.is.vm(file) || $.is.tpl(file)){
				htmlLint(file);

			}else if($.is.css(file) || $.is.less(file) || $.is.sass(file)){
				cssLint(file);

			}else if($.is.js(file)){
				jsLint(file);

			}else{
				console.log('jdf warning: can not lint the [' + file + '].\n');
			}
		}else{
			console.log('jdf error: the [' + file + '] may be not exist.');
		}
	}
}

function htmlLint(filename){
	var content = f.read(filename);
	console.log(colors.yellow(os.EOL + 'jdf htmllint: ', filename));

	Htmllint(content).forEach(function(item, index){
		console.log('#' + (index+1));
		console.log(colors.red('> '), 'line: ' + item.line + ', column: ' + item.column);
		console.log(colors.red('> '), 'msg: ' + item.msg);
	});
}

function cssLint(filename){
	var content = f.read(filename);
	var result = Csslint.verify(content);
		
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

		console.log(colors.yellow(os.EOL + 'jdf csslint: ' + filename));

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

function jsLint(filename){
	var result = Jslint.JSLINT(f.read(filename));

    if(result) {
        console.log(os.EOL+filename+' is OK.');
    }else{
        console.log(colors.yellow(os.EOL + 'jdf jslint: ' + filename));
        Jslint.JSLINT.errors.forEach(function (error, index) {
            if(error){
                console.log('#'+(index+1));
                console.log(colors.red('> '), 'line: ' + $.getVar(error.line) + ', column: ' + $.getVar(error.character));
                console.log(colors.red('> '), 'msg: ' + $.getVar(error.reason));
                console.log(colors.red('> '), 'at: ' + $.getVar(error.evidence).replace(/\t/g,''));
            }
        });
    }
}

function httpLinkLint(link){
	$.httpget(link, function(data){
		console.log(colors.yellow(os.EOL + 'jdf http-link-lint: ', link));
		Htmllint(data).forEach(function(item, index){
			console.log('#' + (index+1));
			console.log(colors.red('> '), 'line: ' + item.line + ', column: ' + item.column);
			console.log(colors.red('> '), 'msg: ' + item.msg);
		});
	});
}