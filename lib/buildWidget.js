/**
* @build widget 引入其内容和相关css,js文件以及css,js路径替换
* @param inputPath 文件路径
* @param content 文件内容
* @param type 编译类型 build || release
* @example 
	{%widget name="unit"%} 
	==> 
	<link type="text/css" rel="stylesheet"  href="/widget/base/base.css" source="widget"/>
	==>
	<link type="text/css" rel="stylesheet"  href="/app/css/widget.css" source="widget"/>

	删除和替换 {%widgetOutputName="mywidgetname"%}
*/

var path = require('path');
var fs = require('fs');

//lib自身组件
var $ = require('./base.js');
var f = require('./file.js');
var jdf = require('./jdf.js');
var Vm = require("./vm.js");

//exports
var buildWidget = module.exports = {};

/**
 * @init
 */
buildWidget.init = function(inputPath,content,type,callback){
	//css,js路径替换
	if (type == 'output') {
		content = staticUrlReplace(content);
	}

	var result = content.match($.reg.widget());
	var origin = content;
	var isJM = false;
	var cssFile='' , jsFile='';
	
	//widget
	if (result){
		var filesListObj = {};//去重用
		result.forEach(function(resultItem){
			var widgetArray = $.reg.widget().exec(resultItem);
			var widgetType;
			var widgetTypeArray = $.reg.widgetType().exec(resultItem);
			
			//jdj jdm 特殊处理
			if (widgetTypeArray) widgetType = widgetTypeArray[1];
			isJM = (widgetType == 'jdj' || widgetType == 'jdm');
			//if (isJM){ writeJMOnce = true; }
			
			//取widget数据 {%widget data=" "%}
			var widgetData;
			var widgetDataArray = $.reg.widgetData().exec(resultItem);
			if (widgetDataArray) widgetData = widgetDataArray[1];
			
			//如果type为js或者css则只引用不处理tpl
			var buildTplTag = true;
			var buildVmTag = true;
			var buildJsTag = true;
			var buildCssTag = true;
			if (widgetType) {
				if (widgetType =='tpl'||widgetType =='vm'||widgetType =='css'||widgetType =='js' ) {
					if (widgetType =='tpl') {
						buildJsTag = false;
						buildCssTag = false;
						buildVmTag = false;
					}
					if (widgetType =='vm') {
						buildJsTag = false;
						buildCssTag = false;
						buildTplTag = false;
					}
					if (widgetType =='css') {
						buildTplTag = false;
						buildJsTag = false;
						buildVmTag = false;
					}
					if (widgetType =='js') {
						buildTplTag = false;
						buildCssTag = false;
						buildVmTag = false;
					}
				}else {
					console.log(inputPath +' '+ resultItem);
					console.log("jdf warnning [widget type - "+widgetType +'] is not approve, please try "tpl,vm,js,css" again ');
					return;
				}
			}

			//console.log(buildTplTag +','+ buildVmTag +','+buildJsTag +','+ buildCssTag );

			//{%widget name=" "%}
			var widgetStr = widgetArray[0];
			//widgetStr中的name
			var widgetName = $.trim(widgetArray[1]);
			var widgetDir = '/widget/' +widgetName;
			//widget 目录
			var fileDir = path.normalize(jdf.currentDir + widgetDir);

			//当前工程不存的jdj和jdm模块从服务端文件复制至当前过来
			if (isJM && !f.exists(fileDir)){
				var source = path.normalize(jdf[widgetType+'Dir']+ widgetDir);
				var target = jdf.currentDir + '/widget/' +widgetName;
				f.copy(source,target);
			}

			var placeholder='';
			var dirExists = f.exists(fileDir);
			if (dirExists){
				var files = fs.readdirSync(fileDir);
				files.forEach(function(item){
					//less,scss文件转换成css文件
					var itemOrgin = item;
					item = $.getCssExtname(item);

					//tpl,css,js路径中含有widgetName前缀的才引用 ---> 名字完全一样才引用
				
					//单个文件
					var fileUrl = path.join(fileDir, item);
					
					/**
					 * @build widget tpl/vm
					 */
					//vm编译
					var vmCompileFn = function(vmContent){
						var fileUrlDirname = path.dirname(fileUrl)+'/';
						var dataSourceContent={};
						var dataSourceUrl = fileUrlDirname+widgetName+$.is.dataSourceSuffix ;
						try {
							if (f.exists(dataSourceUrl)) {
								var temp = f.read(dataSourceUrl);
								if (temp && temp != '')  dataSourceContent = JSON.parse(temp);
							}
						} catch (e) {
							console.log(dataSourceUrl);
							console.log(e);
							return;
						}

						try {
							var widgetDataObj = {};
							if (widgetData){
								widgetDataObj = JSON.parse(widgetData);
							}
						} catch (e) {
							console.log('jdf widget ' +widgetName  +' data error');
							console.log(widgetData);
							console.log(e);
							return;
						}

						var dataObj = $.merageObj( dataSourceContent, widgetDataObj);
						
						//vm处理
						try {
							if (dataObj && vmContent && jdf.config.output.vm){
								return Vm.rander(vmContent, dataObj, fileUrlDirname);
							}
						} catch (e) {
							console.log('jdf erro [jdf.buildWidget] - velocityjs');
							console.log(fileUrl);
							console.log(e);
						}

						return vmContent;
					}
					
					//tpl vm Compile
					var tmplCompileFn = function(isVm){
						placeholder = f.read(fileUrl);
						if (isVm) {
							placeholder = vmCompileFn(placeholder);
						}					
						fileUrl = f.pathFormat(path.join(widgetDir, item));
						var typeHtml='';
						if (widgetType) typeHtml='['+widgetType+']';
						if ( jdf.config.build.widgetIncludeComment ){						
							placeholder = '\r\n<!-- '+typeHtml+' '+fileUrl+' -->\r\n' + placeholder + '\r\n<!--/ '+fileUrl+' -->';
						}
					}
					
					//tpl
					if ( $.is.tpl(item) && buildTplTag && (item == widgetName+$.is.tplSuffix) ){
						tmplCompileFn(true);
					}

					//vm
					if ( $.is.vm(item) && buildVmTag && item == widgetName+$.is.vmSuffix ){
						tmplCompileFn(true);
					}

					var staticUrl = ''+widgetDir +'/'+ item;
					
					/**
					 * @build widget css
					 */
					if ($.is.css(item) && !filesListObj[fileUrl] && buildCssTag && item == widgetName+$.is.cssSuffix ){
						var cssLink = $.placeholder.cssLink(staticUrl);
						if (type == 'build'){
							content = $.placeholder.insertHead(content,cssLink);
						}else if (type == 'release' || type == 'output'){
							//less,sass文件从编译后的bgCurrent读取
							if ($.is.less(itemOrgin) || $.is.sass(itemOrgin)) {
								var fileUrlTemp = jdf.bgCurrentDir + fileUrl.replace(jdf.currentDir,'');
								cssFile +=  f.read(fileUrlTemp) + '\n\r';
							}else{
								cssFile +=  f.read(fileUrl) + '\n\r';
							}
						}

						if (isJM){
							origin = $.placeholder.insertHead(origin,cssLink);
						}
						filesListObj[fileUrl] = 1;
					}

					/**
					 * @build widget js
					 */
					if ($.is.js(item) && !filesListObj[fileUrl] && buildJsTag && item == widgetName+$.is.jsSuffix){
						var jsLink = $.placeholder.jsLink(staticUrl);
						if (type == 'build'){
							//考虑到性能 insertHead -> insertBody
							content = $.placeholder.insertBody(content,jsLink);
						}else if (type == 'release' || type == 'output'){
							jsFile += f.read(fileUrl) + '\n\r';
						}
						if (isJM){
							origin = $.placeholder.insertBody(origin,jsLink);
						}
						filesListObj[fileUrl] = 1;
					}
				});

				if (isJM){
					origin = origin.replace(widgetStr,placeholder);
				}

				//替换掉{%widget name="base"%} 
				content = content.replace(widgetStr,placeholder);
			}else{
				console.log('jdf warning [jdf.buildWidget] ' +widgetStr +' widget '+ widgetName+ ' does not exist.');
			}
		});
		
		//去掉{%widgetOutputName="mywidgetname"%}
		var getContentWidgetOutputName = $.reg.widgetOutputName().exec(content);
		if ( getContentWidgetOutputName ){
			content = content.replace(getContentWidgetOutputName[0],'');
		}

		//release output处理
		if (type == 'release' || type == 'output'){
			//var pkgName = jdf.config.widgetOutputName;
			var pkgName = path.basename(inputPath).replace('.html', '');
			
			if ( getContentWidgetOutputName ){
				pkgName = getContentWidgetOutputName[1];
			}

			var outputDir = jdf.bgCurrentDir;
			var outputCss = '/' + jdf.config.cssDir+'/'+pkgName+'.css';
			var outputJs = '/' + jdf.config.jsDir+'/'+pkgName+'.js';

			if (type == 'output') {
				outputCss = '/' +  jdf.getProjectPath() + '/css/'+pkgName+'.css';
				outputCss = $.replaceSlash(outputCss);
				outputCss = jdf.config.cdn + outputCss;

				outputJs = '/' + jdf.getProjectPath() + '/js/'+pkgName+'.js';
				outputJs = $.replaceSlash(outputJs);
				outputJs = jdf.config.cdn + outputJs;
			}

			var cssLink = $.placeholder.cssLink(outputCss);
			
			//css链接加前缀
			content = $.placeholder.insertHead(content, cssLink  );
			f.write(path.normalize(outputDir+'/' + jdf.config.cssDir+'/'+pkgName+'.css') , cssFile);
			
			//js链接加前缀
			var jsLink = $.placeholder.jsLink(outputJs) ;
			content = $.placeholder.insertBody(content, jsLink );
			//取内容写入pkg文件中
			f.write(path.normalize(outputDir+'/' + jdf.config.jsDir+'/'+pkgName+'.js') , jsFile);
		}
	}
	
	if (type == 'release' || type == 'output'){
		//seajsAddCdn
		content = seajsAddCdn(content);

		//widgetImgAddCdn
		content = widgetImgAddCdn(content);
	}

	var data = {
		origin:origin,
		tpl:content,
		css:cssFile,
		js:jsFile
	}
	if (callback) callback(data);
}

/**
* @静态资源css,js链接替换处理: js直接加cdn, css链接combo后加cdn, 
* @param {String} str 源代码
* @return {String} 替换后的源代码
* @example
	<link type="text/css" rel="stylesheet"  href="../app/css/main.css" />
	<link type="text/css" rel="stylesheet"  href="../app/css/less.css" />
	==>
	<link type="text/css" rel="stylesheet"  href="http://cdnul.com/??productpath/css/main.css,productpath/css/less.css" />

	<script type="text/javascript" src="../app/js/common.js"></script>
	 ==>
	<script type="text/javascript" src="http://cdnul.com/productpath/js/common.js"></script>
*/
function staticUrlReplace(str){
	var cssReplace= function (str,regStr){
		var reg = new RegExp(regStr,'gm');
		var regResult =  str.match(reg);
		// console.log(regResult);
		if (regResult){
			var comboArray = [];
			regResult.forEach(function(item){
				var reg = new RegExp(regStr,'gm');
				var i = reg.exec(item);

				var cdnReg = new RegExp(jdf.config.cdn+'/', 'gm');
				if(i && !cdnReg.test(i[1]) ){
					var t = i[1].replace(cdnReg, '');
					str = str.replace(i['input'], '');
					//comboArray.push(t);
				}

				if ( i && !$.is.httpLink(i[1]) ){
					//css url
					var j = i[1];
					j = j.replace(jdf.config.baseDir, '');
					j = j.replace(/\.\.\//g,'/');

					//add projectPath
					j = jdf.getProjectPath() +	j;

					// del ../  ./  
					if (j.charAt(0) == '/') { j = j.replace('/','');}
					// // ==> /
					j = j.replace(/\/\//gm,'/');

					var widgetReg = new RegExp('^'+jdf.config.widgetDir, 'gm');
					if(! widgetReg.test(j)){
						comboArray.push(j);
						str = str.replace(i['input'], '');
					}
				}
			});
			
			if(comboArray.length>0){			
				var cdnPrefix = '';
				if (jdf.config.cdn) {
					cdnPrefix = jdf.config.cdn + '/??';
				}
				var comboUrl = comboArray.join(',');
				comboUrl = comboUrl.replace(/\/\//gm,'/');
				var staticUrl =  cdnPrefix + comboUrl;
				var cssLink = '\r\n' + $.placeholder.csscomboLink(staticUrl);
				//console.log(cssLink);
				if (/<\/head>/.test(str)) {
					str = $.placeholder.insertHead(str, cssLink);
				} else{
					str += cssLink;
				};
			}
			//console.log(comboArray);
		}
		return str;
	}

	var jsReplace= function (str,regStr){
		var reg = new RegExp(regStr,'gm');
		var regResult =  str.match(reg);
		if (regResult){
			regResult.forEach(function(item){
				var reg = new RegExp(regStr,'gm');
				var i = reg.exec(item);
				if ( i && !$.is.httpLink(i[1]) ){
					//url
					var j = i[1];
					j = j.replace(jdf.config.baseDir, '');
					j = j.replace(/\.\.\//g,'');
			
					//add projectPath
					j = jdf.getProjectPath() +	j;
					
					// del ../  ./  
					if (j.charAt(0) == '/') { j = j.replace('/','');}
					// // ==> /
					j = j.replace(/\/\//gm,'/');
					
					//add cdn
					j =  '/' + j;
					j = $.replaceSlash(j);
					j = jdf.config.cdn +  j;

					//replace
					var r = new RegExp(i[1],'gm');
					
					str = str.replace(r,j);
				}
			});
		}
		return str;
	}

	str = cssReplace(str, $.reg.cssStr);
	str = jsReplace(str, $.reg.jsStr);
	return str;
}

/**
* @seajs.use add prefix 
* @example  
*	seajs.use(['/a.js', '/b.js'],function(){}) ==> 
*	seajs.use(['projectPath/a.js', 'projectPath/b.js'],function(){})
*/
function seajsAddCdn(source){
	var configBaseDir = jdf.config.baseDir ? jdf.config.baseDir+'/'  : '';
	var tag = source.match(/seajs.use\((.*?)\S*[function)|]/gmi);
	if (tag) {
		var tempObj = {};
		for (var i =0, j= tag.length; i<j; i++){
			var  t= tag[i].replace(/seajs.use\(|\[|\]|\)/gim, "");
			t = t.replace(/function\(/gim, "");
			var t1 = t.split(',');
			if (t1) {
				for (var m=0; m<t1.length; m++ ){
					var t2 = t1[m].replace(/\"/g, '').replace(/\'/g, '');
					if (/\.js$/.test(t2)) {
						var t3 = jdf.getProjectPath() + t2.replace(configBaseDir, '');
						t3 = t3.replace(/\.\.\//gm, '/').replace(/\/\//gm, '/');
						//console.log(t2 +','+ t3);
						tempObj[t2] = t3;
					}
				}
			}
		}
		
		for (var i in  tempObj ){
			var reg = new RegExp(i, 'gim');
			source = source.replace(reg, tempObj[i]);
		}
	}
	return source;
}


/**
 * @widget img add cdn prefix
 * @example 
 	<img src="/widget/a/a.png"><img src='/widget/a/a.png'><img src='../widget/a/a.png'><img src="./widget/a/a.png"> 
 	--->
 	<img src="http://cdn.com/projectPath/widget/a/a.png">
 */
function widgetImgAddCdn(source){
	var configBaseDir = jdf.config.baseDir ? jdf.config.baseDir+'/'  : '';
	var tag = source.match(/["|'][\\.]*\/widget\/\S*["|']/gmi);
	if (tag) {
		var tempObj = {};
		for (var i =0, j= tag.length; i<j; i++){
			var  t = tag[i].replace(/["|']/gim, "");
			var t1 = jdf.config.cdn + '/' + jdf.getProjectPath() + t.replace(/^\.*/, "");
			tempObj[t] = t1;
		}
		for (var i in tempObj ){
			var reg = new RegExp(i, 'gim');
			source = source.replace(reg, tempObj[i]);
		}
	}
	return source;
}