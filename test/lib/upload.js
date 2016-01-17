var ftp = require('../../lib/ftp.js');
var assert = require('assert');


describe('Upload', function(){
	describe('#upload()', function(){
		it('upload文件', function(){
			var source1 = '../src/';
			var target1 = 'ftptest/';

			ftp.upload(source1, target1);
		});
	});
});