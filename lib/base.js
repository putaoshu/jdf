/**
* @公用方法
*/
var path = require('path');
var fs = require('fs');
var util = require('util');

var $ = module.exports = {
	reg:{
		widget:function(){
			//检测是否存在和取widget name
			return new RegExp('{%widget\\s.*?name="(.*?)".*?%}','gm');
		},
		widgetType:function(){
			//取widget type
			return new RegExp('{%widget\\s.*?type="(.*?)".*?%}','gm');
		},
		cssStr : '<link\\s.*?href="(.*?)".*?>',
		cssLink:function(){
			return new RegExp(this.cssStr,'gm');
		},
		jsStr : '<script\\s.*?src="(.*?)".*?</script>',
		jsLink:function(){
			return new RegExp(this.jsStr,'gm');
		},
		staticPre:function(){
			return new RegExp('.*?static','gm');
		}
	},
	placeholder:{
		csscomboLink : function(url){
			 return '<link type="text/css" rel="stylesheet"  href="'+url+'" source="combo" />\r\n';
		},		
		cssLink : function(url){
			 return '<link type="text/css" rel="stylesheet"  href="'+url+'" source="widget" />\r\n';
		},
		jsLink:function(url){
			 return '<script type="text/javascript" src="'+url+'" source="widget" /></script>\r\n';
		},
		insertHead:function(content,str){
			 return content.replace('</head>',str+'</head>');
		},
		insertBody:function(content,str){
			 return content.replace('</body>',str+'</body>');
		}
	},
	is:{
		tpl : function(pathName){
			 return path.extname(pathName) === '.tpl';
		},
		html : function(pathName){
			 return path.extname(pathName) === '.html';
		},
		css : function(pathName){
			 return path.extname(pathName) === '.css';
		},
		less : function(pathName){
			 return path.extname(pathName) === '.less';
		},
		//这个扩展名比较悲剧
		sass : function(pathName){
			 return path.extname(pathName) === '.scss';
		},
		js : function(pathName){
			 return path.extname(pathName) === '.js';
		},
		png : function(pathName){
			 return path.extname(pathName) === '.png';
		},		
		//图片文件
		img : function(pathName){
			var name = path.extname(pathName);
			return  name === '.jpg' || name === '.jpeg' || name === '.png' || name === '.gif';
		},
		//含有http,https
		httpLink:function(str){
			return /^http:\/\/|https:\/\//.test(str);
		},
		//是否是含有图片文件
		imageFile:function(str){
			return /svg|tiff|wbmp|png|bmp|fax|gif|ico|jfif|jpe|jpeg|jpg|cur$/.test(str);
		}
	},
	/**
	* @去空格
	*/
	trim:function(str){
		 return str.replace(/\s/g,'');
	}
}

/**
* @取当前时间 2014-01-14 
*/
$.getDay = function(separator) {
	if(typeof(separator) == 'undefined'){
		separator = '-';
	}
	var myDate=new Date();
	var year=myDate.getFullYear();
	var month=myDate.getMonth()+1;
	month = month<10 ? '0'+month : month;
	var day=myDate.getDate();
	day = day<10 ? '0'+day : day;
	return year +separator+ month+separator+ day;
}

/**
* @取当前时间 12:11:10 
*/
$.getTime = function(separator) {
	if(typeof(separator) == 'undefined'){
		separator = ':';
	}
	var myDate=new Date();
	var hour=myDate.getHours();
	hour = hour<10 ? '0'+hour : hour;
	var mint=myDate.getMinutes();
	mint = mint<10 ? '0'+mint : mint;
	var seconds=myDate.getSeconds();
	seconds = seconds<10 ? '0'+seconds : seconds;
	var ms = myDate.getMilliseconds();

	return hour +separator+ mint+separator+ seconds+separator+ms;
}

/**
 * @name $.isArray
 * @param {All} obj 主体
 * @return {Boolean} true/false
 */
$.isArray = function(obj){
	return Object.prototype.toString.apply(obj) === '[object Array]';
}

/**
* @less/sass文件名称转css后缀
* @time 2014-3-5
* @example  a.less ==> a.css; a.sass ==> a.css
*/
$.getCssExtname = function(filename) {
    return filename.replace(/(scss|less)$/g, 'css');
}
