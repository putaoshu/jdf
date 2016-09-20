var f = require('../lib/file.js');
var $ = require('../lib/base.js');
var child = require("child_process");
var path = require('path');
var expect = require('expect.js');

describe('jdf output -html...', function(){
	this.timeout(10000);

	var js_smarty = f.read('result/js_smarty/js_smarty.html').split('\r\n');

	before(function(done){
		child.exec('jdf o -html', function(error, stdout, stderr){
			if(!error){
				js_smarty_build = f.read('build/jdf-test/html/index.html');

				done();
			}
		});
	});

	describe('#js_smarty tpl', function(){
		it('it should console "Hello js_smarty"', function(){
			expect(js_smarty_build).to.contain(js_smarty);
		})
	})
})