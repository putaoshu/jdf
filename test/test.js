/**
* @测试用例
* @2014-2-21 10:45:59
*/
var jdf = require('../lib/jdf.js');
var f = require('../lib/file.js');

/**
* @replace test
*/
console.log('compress css');
console.log(jdf.compressCss('./lib/css.css'));


/**
* @jdf.compressJs
*/
console.log('\n\n');
console.log('compress js');
console.log(jdf.compressJs('./lib/js1.js'));
console.log('\n\n');
console.log(jdf.compressJs('./lib/js2.js'));


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