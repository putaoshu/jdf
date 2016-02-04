/**
* @build less/sass to css
* @ctime 2014-3-5
* 
* @less 文档 http://lesscss.org/#using-less-configuration syncImport
* @npm https://npmjs.org/package/less
* @Dist folder file size is big  ==> https://github.com/less/less.js/issues/1918
* 
* @sass 文档 https://www.npmjs.org/package/node-sass
* @github https://github.com/andrew/node-sass
* @npm https://npmjs.org/package/node-sass
* @Compatibility @mixin has "};"   ==>  https://github.com/andrew/node-sass/issues/254
* 
*/

var path = require('path');
var fs = require('fs');

//lib自身组件
var $ = require('./base.js');
var f = require('./file.js');
var jdf = require('./jdf.js');
var fileLint = require('./fileLint.js');

//外部组件
var Sass = require('jdf-sass');
var Less = require('less');

//exports
var buildCss = module.exports = {};

/**
 * @init
 */
buildCss.init = function(rSource, target){
	var allTag = true;
	var source = f.realpath(rSource);

	if(source){
		if(f.isDir(source)){
			fs.readdirSync(source).forEach(function(name){
				if(name != '.' && name != '..' && !(/.svn/.test(name))) {
					allTag = buildCss.init(source + '/' + name, target + '/' + name) && allTag;
				}
			});
		} else if(f.isFile(source)){
			if( $.is.less(source) || $.is.sass(source) ) {
				var sourceContent = f.read(source);
				//为空 "node-sass": "0.9.3" 编译会报错 https://github.com/sass/node-sass/issues/381
				if(sourceContent==''){
					return;	
				}

				target = $.getCssExtname(target);
				
				if($.is.less(source) && jdf.config.build.less){
					try{
						Less.render(sourceContent, {filename: source, syncImport:true}, function(error, output){
							if(error){
								console.log(error);
							}else{
								var targetContent = output.css;
								if(jdf.config.build.csslint) fileLint.init(source);
								f.write(target, targetContent);
							}
						});
					}catch(e){
						console.log('jdf error [jdf.buildCss] - less\r\n'+source);
						console.log(e);
					}
				}

				if($.is.sass(source) && jdf.config.build.sass){
					try{
						var css = Sass.renderSync({
							data: sourceContent,
							includePaths: [path.dirname(source)],
							// outputStyle: 'compressed'
							outputStyle: 'expanded'
						});
						if(jdf.config.build.csslint) fileLint.init(source);
						f.write(target, css.css);
					}catch(e){
						console.log('jdf error [jdf.buildCss] - sass\r\n'+source);
						console.log(e);
					}
				}
			}
		} else {
			allTag = false;
		}
	} else {
		//console.log('error');
	}
	return allTag;
}