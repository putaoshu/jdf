var autoprefixer = require('autoprefixer');
var postcss      = require('postcss');
var cssnext      = require('cssnext');
var f      		 = require('./file');
 
var doAutoprefixer = module.exports = {};
doAutoprefixer.init = function(file, options){
	var contents = postcss([autoprefixer(options), cssnext]).process(file.contents).css;
	f.write(file.path, contents);
}

