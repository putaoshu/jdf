define( 'unit/test/test.js' , function(require, exports, module) {
	var lib = require('unit/lib/lib.js');
	var lib2 = require('unit/lib2/lib2.js');
	var lib3 = require('http://wwww.unit/lib3.js');
	var lib4 = require('http://cdn/test4.css');
	function init() {
		return 111;
	}
	return init;
});