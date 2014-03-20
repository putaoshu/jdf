define(function(require,exports,module){
	var lazyload = require('jdf/1.0.0/ui/lazyload/1.0.0/lazyload.js');
	var trimPath = require('jdf/1.0.0/unit/trimPath/1.0.0/trimPath.js');
	
    function init(options){
		options = $.extend({
			el:null
		}, options || {});

		options.el.append('<div id="product-track"></div>');
		$('#product-track').html('').attr('data-lazyload', true);

		$('body').lazyload({
			type:'fn',
			source:$('#product-track'),
			onchange:function(){
				footprint();
			}
		});
    }
	return init;
});