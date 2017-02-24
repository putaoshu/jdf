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
var jsmart = require('jsmart');

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
buildWidget.init = function(inputPath,content,type,callback,param){
	if(jdf.config.build.hasCmdLog) console.log('buildWidget---'+inputPath);

	var isBuild = type == 'build';
	var isRelease = type == 'release';
	var isOutput = type == 'output';

	var result = content.match($.reg.notCommentWidget());
	var origin = content;
	var isJM = false;
	var cssFile='' , jsFile='';
	var cssComboArr = [];
	var jsComboArr = [];
	
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
			
			//取widget是否注释tag {%widget comment=" "%}
			var widgetComment;
			var widgetCommentArray = $.reg.widgetComment().exec(resultItem);
			if (widgetCommentArray) widgetComment = widgetCommentArray[1];

			//如果type为js或者css则只引用不处理tpl
			var buildTag = {
				tpl:true,
				vm:true,
				smarty: true,
				js:true,
				css:true
			}

			if (widgetType) {
				if (widgetType =='tpl'|| widgetType =='vm'|| widgetType =='css'|| widgetType =='js' || widgetType == 'smarty'){
					for(var i in buildTag ){
						if(i != widgetType ) buildTag[i] = false;
					}
				}else {
					console.log(inputPath +' '+ resultItem);
					console.log("jdf warnning [widget type - "+widgetType +'] is not approve, please try "tpl,vm,js,css" again ');
					return;
				}
			}

			//{%widget name=" "%}
			var widgetStr = widgetArray[0];
			//widgetStr中的name
			var widgetName = $.trim(widgetArray[1]);
			var widgetDir = '/widget/' +widgetName;
			//widget 目录
			var fileDir = path.normalize(jdf.currentDir + widgetDir);
			var widgetInputName = jdf.config.widgetInputName;

			if(widgetInputName.length > 0 && !$.inArray(widgetInputName, widgetName)){
				return;
			}

			//当前工程不存的jdj和jdm模块从服务端文件复制至当前过来
			/*
			if (isJM && !f.exists(fileDir)){
				var source = path.normalize(jdf[widgetType+'Dir']+ widgetDir);
				var target = jdf.currentDir + '/widget/' +widgetName;
				f.copy(source,target);
			}*/
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
					var staticUrl = ''+widgetDir +'/'+ item;

					if (param && param.plain) {
						staticUrl = '..'+widgetDir +'/'+ item;
					}

					//css Compile && innsertCSS link
					var cssCompileFn = function(staticUrl){
						var cssLink = $.placeholder.cssLink(staticUrl);
						if (isBuild){
							content = $.placeholder.insertHead(content,cssLink);
						}else if(isRelease || isOutput){
							if(jdf.config.output.combineWidgetCss){
								//less,sass文件从编译后的bgCurrent读取
								if ($.is.less(itemOrgin) || $.is.sass(itemOrgin)) {
									var fileUrlTemp = jdf.bgCurrentDir + staticUrl;
									cssFile +=  f.read(fileUrlTemp) + '\n\r';
								}else{
									cssFile +=  f.read(jdf.bgCurrentDir+staticUrl) + '\n\r';
								}
							}else{
								if(jdf.config.output.cssCombo && jdf.config.cdn){
									cssComboArr.push(staticUrl.replace('/widget/', ''));
								}else{
									content = $.placeholder.insertHead(content,cssLink);
								}
							}
						}

						/*
						if (isJM){
							origin = $.placeholder.insertHead(origin,cssLink);
						}*/
						filesListObj[staticUrl] = 1;
					}

					//js Compile
					var jsCompileFn = function(staticUrl){
						var jsLink = $.placeholder.jsLink(staticUrl);
						if (isBuild){
							content = buildWidget.insertJs(content,jsLink, jdf.config.build.jsPlace);
						}else if (isRelease || isOutput){
							if(jdf.config.output.combineWidgetJs){
								//合并所有widget中的js文件至widgetOutputName
								jsFile += f.read(jdf.currentDir+staticUrl) + '\n\r';
							}else{
								if(jdf.config.output.jsCombo && jdf.config.cdn){
									jsComboArr.push(staticUrl.replace('/widget/', ''));
								}else{
									content = buildWidget.insertJs(content,jsLink, jdf.config.output.jsPlace);
								}
							}
						}
						/*
						if (isJM){
							origin = $.placeholder.insertBody(origin,jsLink);
						}*/
						filesListObj[staticUrl] = 1;	 
					}

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

						var widgetDataObj = {};
						try {
							if (widgetData){
								//外部url，如data='http://a.com/'
								if($.is.httpLink(widgetData)){
					                var request = require('sync-request');
									var res = request('GET', widgetData);
									widgetData = res.getBody().toString();
								}
								
								//纯json数据				
								widgetDataObj = JSON.parse(widgetData);
							}
						} catch (e) {
							console.log('jdf buildWidget {%widget name="' +widgetName  +'"} data error');
							console.log(e);
							return;
						}

						var dataObj = $.merageObj( dataSourceContent, widgetDataObj);
						
						//vm处理
						try {
							if (dataObj && vmContent && jdf.config.output.vm){
								var vmRander =  Vm.rander(vmContent, dataObj, fileUrlDirname);
								
								//vm继承js/css
								if(vmRander.url.js){
									vmRander.url.js.forEach(function(item){
										 jsCompileFn(item);
									})
								}

								if(vmRander.url.css){
									vmRander.url.css.forEach(function(item){
										 cssCompileFn(item);
									})
								}
								return vmRander.content;
							}
						} catch (e) {
							console.log('jdf erro [jdf.buildWidget] - velocityjs');
							console.log(fileUrl);
							console.log(e);
						}

						return vmContent;
					}
					
					//tpl vm Compile
					var tmplCompileFn = function(type){
						placeholder = f.read(fileUrl);
						//替换模板中的cssLink/jsLink
						if (isOutput) placeholder = staticUrlReplace(placeholder);

						if (type == 'vm' || type == 'tpl') {
							placeholder = vmCompileFn(placeholder);
						}

						if(type == 'smarty'){
							var smartyJSON = f.read(path.join(fileDir, widgetName+'.json')) || widgetData;
							var smartyCompiled = new jSmart(placeholder);

							if(smartyCompiled && smartyJSON){
								placeholder = smartyCompiled.fetch(JSON.parse(smartyJSON));
							}
						}

						fileUrl = f.pathFormat(path.join(widgetDir, item));
						
						var typeHtml='';
						if (widgetType) typeHtml='['+widgetType+']';
						//insert comment
						if ( jdf.config.build.widgetIncludeComment){
							if(widgetComment === 'false') return;
							if(/<\!DOCTYPE/.test(placeholder)){
								placeholder = placeholder + '\r\n<!--/ '+fileUrl+' -->';
							}else{
								placeholder = '<!-- '+typeHtml+' '+fileUrl+' -->\r\n' + placeholder + '\r\n<!--/ '+fileUrl+' -->';
							}
						}
					}
					
					//tpl
					if ( $.is.tpl(item) && buildTag.tpl && (item == widgetName+$.is.tplSuffix) ){
						tmplCompileFn('tpl');
					}

					//vm
					if ( $.is.vm(item) && buildTag.vm && item == widgetName+$.is.vmSuffix ){
						tmplCompileFn('vm');
					}

					//smarty
					if ( $.is.smarty(item) && buildTag.smarty && item == widgetName+$.is.smartySuffix ){
						tmplCompileFn('smarty');
					}

					/**
					 * @build widget css
					 */
					if ($.is.css(item) && !filesListObj[staticUrl] && buildTag.css && item == widgetName+$.is.cssSuffix ){
						cssCompileFn(staticUrl);
					}

					/**
					 * @build widget js
					 */
					if ($.is.js(item) && !filesListObj[staticUrl] && buildTag.js && item == widgetName+$.is.jsSuffix){
						jsCompileFn(staticUrl);
					}
				});
				/*
				if (isJM){
					origin = origin.replace(widgetStr,placeholder);
				}*/
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

		//css,js路径替换
		if (isOutput) content = staticUrlReplace(content);

		//release output处理
		if (isRelease || isOutput){
			//修改为默认取配置文件中的widgetOutputName 2014-5-24
			var pkgName = jdf.config.widgetOutputName;
			//var pkgName = path.basename(inputPath).replace('.html', '');
			if (getContentWidgetOutputName){
				pkgName = getContentWidgetOutputName[1];
			}

			var outputDir = jdf.bgCurrentDir;
			var outputCss = '/' + jdf.config.cssDir+'/'+pkgName+'.css';
			var outputJs = '/' + jdf.config.jsDir+'/'+pkgName+'.js';

			var cssOutputDir = '/' + jdf.config.cssDir.replace(jdf.config.baseDir+'/', '') +'/';
			var jsOutputDir = '/' + jdf.config.jsDir.replace(jdf.config.baseDir+'/', '') +'/';
			if (isOutput) {
				if(jdf.config.cdn){
					outputCss = '/' +  jdf.getProjectPath() + cssOutputDir+pkgName+'.css';
					outputCss = $.replaceSlash(outputCss);
					outputCss = jdf.config.cdn + outputCss;

					outputJs = '/' + jdf.getProjectPath() + jsOutputDir+pkgName+'.js';
					outputJs = $.replaceSlash(outputJs);
					outputJs = jdf.config.cdn + outputJs;
				}else{
					outputCss = addgetProjectPath(cssOutputDir+pkgName+'.css');
					outputJs = addgetProjectPath(jsOutputDir+pkgName+'.js');
				}
			}

			//seajsAddCdn
			content = seajsAddCdn(content);

			//widgetUrlAddCdn
			content = widgetUrlAddCdn(content);
	
			//css链接加前缀
			if(jdf.config.output.combineWidgetCss && cssFile !=''){
				var cssLink = $.placeholder.cssLink(outputCss);
				content = $.placeholder.insertHead(content, cssLink  );
				f.write(path.normalize(outputDir+'/' + jdf.config.cssDir+'/'+pkgName+'.css') , cssFile);
			}else if(jdf.config.output.cssCombo && cssComboArr.length){
				cssComboArr = $.uniq(cssComboArr);
				var outputCss1 = '/' +  jdf.getProjectPath() +'/widget/??'+cssComboArr.join(',');
				outputCss1 = jdf.config.cdn + $.replaceSlash(outputCss1);
				var cssLink1 = $.placeholder.cssLink(outputCss1);
				content = $.placeholder.insertHead(content, cssLink1);
			}

			//js链接加前缀
			if(jdf.config.output.combineWidgetJs && jsFile !=''){
				var jsLink = $.placeholder.jsLink(outputJs);
				content = buildWidget.insertJs(content,jsLink,jdf.config.output.jsPlace);
				f.write(path.normalize(outputDir+'/' + jdf.config.jsDir+'/'+pkgName+'.js') , jsFile);
			}else if(jdf.config.output.jsCombo && jsComboArr.length){
				jsComboArr = $.uniq(jsComboArr);
				var outputJs1 = '/' +  jdf.getProjectPath() +'/widget/??'+jsComboArr.join(',');
				outputJs1 = jdf.config.cdn + $.replaceSlash(outputJs1);
				var jsLink1 = $.placeholder.jsLink(outputJs1);
				content = buildWidget.insertJs(content,jsLink1, jdf.config.output.jsPlace);
			}
		}
	}else{
		//css,js路径替换
		if (isOutput) content = staticUrlReplace(content);

		if (isRelease || isOutput){
			//seajsAddCdn
			content = seajsAddCdn(content);
		}

		if (isOutput){
			//widgetUrlAddCdn
			content = widgetUrlAddCdn(content);
		}
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
 * @insertJs
 * @(考虑到性能 insertHead -> insertBody) -> 放head有利于前后端沟通,可通过配置修改
 * @jdf.config.output.jsPlace 'insertHead' --> header ; 'insertBody' --> body
 */
buildWidget.insertJs = function(content, jsLink, jsPlace){
	if(jsPlace == 'insertHead'){
		content = $.placeholder.insertHead(content, jsLink);
	}else if(jsPlace == 'insertBody'){
		content = $.placeholder.insertBody(content, jsLink);
	}
	return content;
}

/**
* @非widget引用, 原页面上的静态资源css, js链接替换处理: js直接加cdn, css链接根据配置是否combo加cdn
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
	var replaceCore= function (str,type){
		var regStr = $.reg[type+'Str'];
		var reg = new RegExp(regStr,'gm');
		var regResult =  str.match(reg);
		
		if (regResult){
			var comboArray = [];
			regResult.forEach(function(item){
				var reg = new RegExp(regStr,'gm');
				var i = reg.exec(item);
				var cdnRegStr = jdf.config.cdnDefalut ? jdf.config.cdnDefalut : jdf.config.cdn;
				var cdnReg = new RegExp(cdnRegStr+'/', 'gm');
				var k = i['input'];

				var strReplace = function (){
					if(!/href="\/\//.test(k)){
						//默认的js/css路径置为空
						var kReg = new RegExp(k, 'gmi')
						var JReg = new RegExp(k+'\r\n', 'gmi')
						str = str.replace(kReg, '');
						str = str.replace(JReg, '');
					}
				}

				if(i && !cdnReg.test(i[1]) && !$.is.httpLink(i[1]) ){
					//var t = i[1].replace(cdnReg, '');
					//comboArray.push(t);
					strReplace();
				}

				if ( i && !$.is.httpLink(i[1]) ){
					//url
					var j = i[1];
					j = projectPathReplace(j);

					var widgetReg = new RegExp('^'+jdf.config.widgetDir, 'gm');
					if(! widgetReg.test(j)){
						comboArray.push(j);
						strReplace();
					}
				}
			});

			//console.log(comboArray);
			if(comboArray.length>0){
				comboArray = $.uniq(comboArray);
				var tagSrc = '';
				
				//combo
				if(jdf.config.output[type+'Combo'] && jdf.config.cdn){
					var cdnPrefix = '';
					cdnPrefix =  jdf.config.cdn + (comboArray.length>1 ? '/??' : '/');
					var comboUrl = comboArray.join(',');
					comboUrl = comboUrl.replace(/\/\//gm,'/');
					var staticUrl =  cdnPrefix + comboUrl;
					tagSrc = '' + $.placeholder[type+'comboLink'](staticUrl);
				}else{
					for (var i=0; i<comboArray.length; i++){
						var item = comboArray[i];
						item = jdf.config.cdn ? jdf.config.cdn+'/'+item : item;
						item = addgetProjectPath(item) ;
						tagSrc += $.placeholder[type+'Link'](item);
					}
				}

				//console.log(tagSrc);
				// if (/<\/head>/.test(str)) {
					if (type == 'js') {
						str = buildWidget.insertJs(str,tagSrc, jdf.config.output.jsPlace);
					}else{
						str = $.placeholder.insertHead(str, tagSrc);
					}
				// } else{
				// 	str += tagSrc;
				// };
			}
		}
		return str;
	}

	str = replaceCore(str, 'css');
	str = replaceCore(str, 'js');
	return str;
}

/**
* @seajs.use add prefix 
* @example  
*	seajs.use(['/a.js', '/b.js'],function(){}) ==> 
*	seajs.use(['projectPath/a.js', 'projectPath/b.js'],function(){})
*/
function seajsAddCdn(source){
	var cdn = jdf.config.cdn;
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
					//js和widget的路径,'js/a.js'的不做替换
					var t1R = new RegExp(jdf.config.jsDir+'/|'+jdf.config.widgetDir+'/', 'gm');
					if ( t1R.test(t2) && !$.is.httpLink(t2) && 
						( t2.charAt(0) == '/' || t2.charAt(0) == '\\' || t2.charAt(0) == '.' )
					) {
						tempObj[t2] = projectPathReplace(t2);
					}
				}
			}
		}
		
		for (var i in  tempObj ){
			var reg = new RegExp(escape(i), 'gim');

			if(cdn){
				tempObj[i] = cdn + '/' + tempObj[i];
			}
			source = source.replace(reg, tempObj[i]);
		}
	}
	return source;
}

/**
 * @addgetProjectPath
 */
function addgetProjectPath(str){
	if(!jdf.config.cdn && !/^\.\./.test(str)){
		str = '..'+str;
	}
	return str ;
}

/**
 * @引用widget文件下的img/cssLink/jsLink add cdn prefix
 * @example 
 	<img src="/widget/a/a.png"><img src='/widget/a/a.png'><img src='../widget/a/a.png'><img src="./widget/a/a.png"> 
 	--->
 	<img src="http://cdn.com/projectPath/widget/a/a.png">
 */
function widgetUrlAddCdn(source){
	var configBaseDir = jdf.config.baseDir ? jdf.config.baseDir+'/'  : '';
	var tag = source.match(/["|'][\\.]*\/widget\/\S*["|']/gmi);
	if (tag) {
		var tempObj = {};
		for (var i =0, j= tag.length; i<j; i++){
			var  t = tag[i].replace(/["|']/gim, "");
			var t1 = t;
			if(jdf.config.cdn){
				var t2 = '/' + jdf.getProjectPath() + t.replace(/^\.*/, "");
				t2 = $.replaceSlash(t2);
				t1 = jdf.config.cdn + t2;
			}else{
				t1 = addgetProjectPath(t1) ;
				t1 = $.replaceSlash(t1);
			}

			if(t != t1){
				tempObj[t] = t1;
			}
		}
		for (var i in tempObj ){
			var reg = new RegExp(i, 'gim');
			source = source.replace(reg, tempObj[i]);
		}
	}
	return source;
}


/**
 * @projectPathReplace
 * @ctime 2014-7-5
 * @example 
	/css/index.css
	../css/index.css
	==>
	projectPath/css/index.css
 */
function projectPathReplace(j){
	j = j.replace(jdf.config.baseDir, '');
					
	if(jdf.config.cdn){
		j = j.replace(/\.\.\//g,'/');
		//add projectPath
		j = jdf.getProjectPath() +	j;
		// del ../  ./  
		if (j.charAt(0) == '/') { j = j.replace('/','');}
		// 替换./和//为/
		j = j.replace(/\/\/|\.\//gm, '/');
	}

	// // ==> /
	j = j.replace(/\/\//gm,'/');
	return j;
}

