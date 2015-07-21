/**
* @测试用例
* @2014-2-21 10:45:59
*/
var jdf = require('../../lib/jdf.js');
var f = require('../../lib/file.js');
var compress = require('../../lib/compress.js');
var assert = require('assert');


describe('Compress', function(){
	describe('#css()', function(){
		it('输出 "css.css" 文件里的"background-image"', function(){
			var result = compress.css('../src/css.css');
			f.write('../dest/css.css', result);
		});
	});

	describe('#cssImagesUrlReplace()', function(){
		it('给"background-image"添加cdn', function(){
			var cssStr = '.m .mt .extra a:link,.m .mt .extra a:visited,.sm .smt .extra a:link,.sm .smt .extra a:visited{color:#005ea7}';
			var cssStr2 = 'background:#f6f6f6 url(../ico.png);';
			var result = compress.cssImagesUrlReplace(null, cssStr2, 'http://cdn.com/');

			assert.equal('background:#f6f6f6 url(http://cdn.com/ico.png);', result);
		});
	});

	describe('#js()', function(){
		var isdebug = false;

		jdf.getProjectPath = function (){
			 return 'testdir'
		}

		it('"js1.js"文件输出', function(){
			var result = compress.js('../src/js1.js', isdebug);
			f.write('../dest/js1.js', result);
		});

		it('"js2.js"文件输出', function(){
			var result = compress.js('../src/js2.js', isdebug);
			f.write('../dest/js2.js', result);
		});

		it('"js3.js"文件输出', function(){
			var result = compress.js('../src/js3.js', isdebug);
			f.write('../dest/js3.js', result);
		});

		it('"js4.js"文件输出', function(){
			var result = compress.js('../src/js4.js', isdebug);
			f.write('../dest/js4.js', result);
		});

		it('"js5.js"文件输出', function(){
			var result = compress.js('../src/js5.js', isdebug);
			f.write('../dest/js5.js', result);
		});

		it('"js6.js"文件输出', function(){
			var result = compress.js('../src/js6.js', isdebug);
			f.write('../dest/js3.js', result);
		});

		it('"js7.js"文件输出', function(){
			var result = compress.js('../src/js7.js', isdebug);
			f.write('../dest/js7.js', result);
		});

	});
	
});


