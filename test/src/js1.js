/*$
 * it's test.js 
 * @version v1.0
 */

define(   "unit/test/test.js"  ,  function(require, exports, module) {
	var lib = require('unit/lib/lib1.js');
	var lib2 = require('http://cdn/lib2.js');
	var lib3 = require('http://cdn/lib3.css');

	/** 
	*var lib4 = require('unit/lib/lib4.js');
	*/
	//var lib5 = require('unit/lib/lib5.js');

	function init() {
		return "init";
	}
	return init;
});
