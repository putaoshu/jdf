/**
* @测试用例
* @2014-2-21 10:45:59
*/
var jdf = require('../lib/jdf.js');
var f = require('../lib/file.js');
var compress = require('../lib/compress.js');
/**
* @add images prefix
*/
// console.log('compress css');
console.log(compress.css('./lib/css.css'));

var cssStr = '.m .mt .extra a:link,.m .mt .extra a:visited,.sm .smt .extra a:link,.sm .smt .extra a:visited{color:#005ea7}';
var cssStr2 = 'background:#f6f6f6;';
//console.log(compress.cssImagesUrlReplace(cssStr2, 'http://cdn.com'));

/**
* @jdf.compressJs
*/
//define has id, require
var isdebug = false;

//set prefix
jdf.getProjectPath = function (){
	 return 'testdir'
}
console.log(compress.js('./lib/js1.js', isdebug));
console.log(compress.js('./lib/js2.js', isdebug));

//define has require, no id
console.log( compress.js('./lib/js3.js', isdebug) );
console.log(compress.js('./lib/js4.js', isdebug));

//seajs.use
console.log(compress.js('./lib/js5.js', isdebug));
console.log(compress.js('./lib/js6.js', isdebug));
console.log(compress.js('./lib/js7.js', isdebug));

/**
* @f.copy
*/
//f.copy('test/', 'test2/', null, '.css');

/**
* @upload
*/
function upload(){
	console.log('\n\n');

	var ftp = require('../lib/ftp.js');
	var source1 = './lib/';
	var target1 = 'ftptest/';

	ftp.check(function(){
		/*
		ftp.put(source1+'js1.js', target1+'js1.js',function(){
			 ftp.put(source1+'js2.js', target1+'js2.js',function(){
				ftp.quit();
			 });
		});

		ftp.put(source1+'js1.js', target1+'js1.js');
		ftp.put(source1+'js2.js', target1+'js2.js');
		*/
		ftp.upload(source1, target1);
	});
}
//upload();

/**
* @upload
*/

// console.log(jdf.staticUrlReplace(f.read('./lib/html.html')))

