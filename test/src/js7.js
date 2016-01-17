define(function(require,exports,module){
	var lazyload = require('1.js');
	var trimPath = require('2.js');
	
    function init(options){
		options = $.extend({
			el:null
		}, options || {});
    }
	return init;
});