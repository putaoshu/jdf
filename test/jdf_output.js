var f = require('../lib/file.js');
var $ = require('../lib/base.js');
var child = require("child_process");
var path = require('path');
var expect = require('expect.js');

describe('##jdf output...', function(){
	this.timeout(10000);

	var css_background_url = f.read('result/css_background_url/css_background_url.css').split('\r\n');
	var css_background_url_build = '';

	var css_background_sprite_base64 = f.read('result/css_background_sprite_base64/css_background_sprite_base64.css').split('\r\n');
	var css_background_sprite_base64_build = '';

	var css_hack = f.read('result/css_hack/css_hack.css').split('\r\n');
	var css_hack_build = '';

	var js_cmd_define = f.read('result/js_cmd_define/js_cmd_define.js');
	var js_cmd_define_build = '';

	var js_seajs_use = f.read('result/js_seajs_use/js_seajs_use.js');
	var js_seajs_use_build = '';

	var sass_import_lib = f.read('result/sass_import_lib/sass_import_lib.css');
	var sass_import_lib_build = '';

	before(function(done){
		child.exec('jdf o', function(error, stdout, stderr){
			if(!error){
				css_background_url_build = f.read('build/jdf-test/widget/css_background_url/css_background_url.css');
				css_background_sprite_base64_build = f.read('build/jdf-test/widget/css_background_sprite_base64/css_background_sprite_base64.css');
				css_hack_build = f.read('build/jdf-test/widget/css_hack/css_hack.css');

				js_cmd_define_build = f.read('build/jdf-test/widget/js_cmd_define/js_cmd_define.js');
				js_seajs_use_build = f.read('build/jdf-test/widget/js_seajs_use/js_seajs_use.js');

				sass_import_lib_build = f.read('build/jdf-test/widget/sass_import_lib/sass_import_lib.css');

				done();
			}
		});
	});

	describe('#css_background_url', function(){
		css_background_url.forEach(function(item, index){
			it('test' + (index + 1) + ' should equal', function(){
				var css_result = css_background_url[index];
				
				if(css_result){
					expect(css_background_url_build).to.contain(css_result);
				}
			});
		});
	});

	describe('#css_background_sprite_base64', function(){
		css_background_sprite_base64.forEach(function(item, index){
			it('test' + (index + 1) + ' should equal', function(){
				var css_result = css_background_sprite_base64[index];
				
				if(css_result){
					setTimeout(function(){
						expect(css_background_sprite_base64_build).to.contain(css_result);
					}, 200)
				}
			});
		});
	});

	describe('#css_hack', function(){
		css_hack.forEach(function(item, index){
			it('test' + (index + 1) + ' should equal', function(){
				var css_result = css_hack[index];
				
				if(css_result){
					expect(css_hack_build).to.contain(css_result);
				}
			});
		});
	});

	describe('#js_cmd_define', function(){
		it('add cdn and project path for dependence', function(){
			expect(js_cmd_define_build).to.contain(js_cmd_define);
		})
	});

	describe('#js_seajs_use', function(){
		it('add cdn and project path for seajs use', function(){
			expect(js_seajs_use_build).to.contain(js_seajs_use);
		})
	});

	describe('#sass_import_lib', function(){
		it('import lib in sass file', function(){
			expect(sass_import_lib_build).to.contain(sass_import_lib);
		})
	});
});




