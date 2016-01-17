var f = require('../../lib/file.js');
var assert = require('assert');


describe('File', function(){
	describe('#copy()', function(){
		it('copy css文件', function(){
			f.copy('test/', 'test2/', null, '.css');
		});
	});
});
