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
	var isBuild = type == 'build';
	var isRelease = type == 'release';
	var isOutput = type == 'output';

	//css,js路径替换
	if (isOutput) content = staticUrlReplace(content);

	var result = content.match($.reg.widget());
	var origin = content;
	var isJM = false;
	var cssFile='' , jsFile='';
	var cssComboArr = [];
	var jsComboArr = [];

	//widget
	if (result){
		//取得html中所有注释内容
		var commentArray = content.match(/<!--(.|\s)*?-->/gm);
		var filesListObj = {};//去重用
		result.forEach(function(resultItem){
			//是否在注释过了
			if($.inArray(commentArray, resultItem, true)){
				return;
			}
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

					//css Compile
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
									cssFile +=  f.read(jdf.currentDir+staticUrl) + '\n\r';
								}
							}else{
								if(jdf.config.output.cssCombo && jdf.config.cdn){
									cssComboArr.push(staticUrl);
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
									jsComboArr.push(staticUrl);
								}else{
									content = buildWidget.insertJs(content,jsLink, jdf.config.build.jsPlace);
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
					var tmplCompileFn = function(isVm){
						placeholder = f.read(fileUrl);
						//替换模板中的cssLink/jsLink
						if (isOutput) placeholder = staticUrlReplace(placeholder);
						if (isVm) {
							placeholder = vmCompileFn(placeholder);
						}					
						fileUrl = f.pathFormat(path.join(widgetDir, item));
						var typeHtml='';
						if (widgetType) typeHtml='['+widgetType+']';
						if ( jdf.config.build.widgetIncludeComment){
							if(widgetComment === 'false') return;
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

					/**
					 * @build widget css
					 */
					if ($.is.css(item) && !filesListObj[fileUrl] && buildCssTag && item == widgetName+$.is.cssSuffix ){
						cssCompileFn(staticUrl);
					}

					/**
					 * @build widget js
					 */
					if ($.is.js(item) && !filesListObj[fileUrl] && buildJsTag && item == widgetName+$.is.jsSuffix){
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
	
			//js链接加前缀
			if(jdf.config.output.combineWidgetJs && jsFile !=''){
				var jsLink = $.placeholder.jsLink(outputJs) ;
				content = buildWidget.insertJs(content,jsLink,jdf.config.output.jsPlace);
				f.write(path.normalize(outputDir+'/' + jdf.config.jsDir+'/'+pkgName+'.js') , jsFile);
			}else if(jdf.config.output.jsCombo && jsComboArr.length){
				var outputJs1 = '/' +  jdf.getProjectPath() +'??'+jsComboArr.join(',');
				outputJs1 = jdf.config.cdn + $.replaceSlash(outputJs1);
				var jsLink1 = $.placeholder.jsLink(outputJs1);
				content = $.placeholder.insertHead(content, jsLink1);
			}

			//css链接加前缀
			if(jdf.config.output.combineWidgetCss && cssFile !=''){
				var cssLink = $.placeholder.cssLink(outputCss);
				content = $.placeholder.insertHead(content, cssLink  );
				f.write(path.normalize(outputDir+'/' + jdf.config.cssDir+'/'+pkgName+'.css') , cssFile);
			}else if(jdf.config.output.cssCombo && cssComboArr.length){
				var outputCss1 = '/' +  jdf.getProjectPath() +'??'+cssComboArr.join(',');
				outputCss1 = jdf.config.cdn + $.replaceSlash(outputCss1);
				var cssLink1 = $.placeholder.cssLink(outputCss1);
				content = $.placeholder.insertHead(content, cssLink1);
			}
		}
	}
	
	if (isRelease || isOutput){
		//seajsAddCdn
		content = seajsAddCdn(content);
	}

	if (isOutput){
		//widgetUrlAddCdn
		content = widgetUrlAddCdn(content);
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
	var cssReplace= function (str,regStr){
		var reg = new RegExp(regStr,'gm');
		var regResult =  str.match(reg);
		
		if (regResult){
			var comboArray = [];
			regResult.forEach(function(item){
				var reg = new RegExp(regStr,'gm');
				var i = reg.exec(item);
				var cdnRegStr = jdf.config.cdnDefalut ? jdf.config.cdnDefalut : jdf.config.cdn;
				var cdnReg = new RegExp(cdnRegStr+'/', 'gm');
				if(i && !cdnReg.test(i[1]) ){
					var t = i[1].replace(cdnReg, '');
					str = str.replace(i['input'], '');
					//comboArray.push(t);
				}

				if ( i && !$.is.httpLink(i[1]) ){
					//css url
					var j = i[1];
					j = projectPathReplace(j);

					var widgetReg = new RegExp('^'+jdf.config.widgetDir, 'gm');
					if(! widgetReg.test(j)){
						comboArray.push(j);
						str = str.replace(i['input']+'\r\n', '');
					}
				}
			});

			//console.log(comboArray);
			if(comboArray.length>0){
				comboArray = $.uniq(comboArray);
				var cssLink = '\r\n';
				
				//css combo
				if(jdf.config.output.cssCombo && jdf.config.cdn){
					var cdnPrefix = '';
					cdnPrefix =  jdf.config.cdn + 
						(comboArray.length>1 ? '/??' : '/')
					;
					var comboUrl = comboArray.join(',');
					comboUrl = comboUrl.replace(/\/\//gm,'/');
					var staticUrl =  cdnPrefix + comboUrl;
					cssLink = '\r\n' + $.placeholder.csscomboLink(staticUrl);
				}else{
					for (var i=0; i<comboArray.length; i++){
						var item = comboArray[i];
						item = jdf.config.cdn ? jdf.config.cdn+'/'+item : item;
						item = addgetProjectPath(item) ;
						cssLink += $.placeholder.cssLink(item);
					}
				}

				//console.log(cssLink);
				if (/<\/head>/.test(str)) {
					str = $.placeholder.insertHead(str, cssLink);
				} else{
					str += cssLink;
				};	
			}
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
					j = projectPathReplace(j);

					//add cdn
					if(jdf.config.cdn){
						j =  '/' + j;
						j = $.replaceSlash(j);
						j = jdf.config.cdn +  j;
					}
					
					j = addgetProjectPath(j) ;

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
	}

	// // ==> /
	j = j.replace(/\/\//gm,'/');
	return j;
}

