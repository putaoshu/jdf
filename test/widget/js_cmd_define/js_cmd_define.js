define(function(require, exports, module){
	var a = require('a.js');

	var b = require('./b.js');

	var c = require('../c.js');

	var d = require('js/d.js');

	var e = require('/js/e.js');

	var globalInit = require('jdf/1.0.0/unit/globalInit/2.0.0/globalInit.js');

});


define('js_cmd_define.js', ['a.js', '/b.js'], function(require, exports, module){

})