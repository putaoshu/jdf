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
		widgetData:function(){
			//取widget data
			return new RegExp('{%widget\\s.*?data=\'(.*?)\'.*?%}','gm');
		},
		widgetOutputName:function(){
			//当前页面输出的widget name
			return new RegExp('{%widgetOutputName="(.*?)".*?%}','gm');
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
			 return '<script type="text/javascript" src="'+url+'" source="widget" ></script>\r\n';
		},
		insertHead:function(content,str){
			 return content.replace('</head>',str+'</head>');
		},
		insertBody:function(content,str){
			 return content.replace('</body>',str+'</body>');
		}
	},
	is:{
		//数据源文件
		dataSourceSuffix: '.json',
		dataSource : function(pathName){
			 return path.extname(pathName) === this.dataSourceSuffix;			 
		},
		tplSuffix: '.tpl',
		tpl : function(pathName){
			 return path.extname(pathName) === this.tplSuffix;
		},
		vmSuffix: '.vm',
		vm : function(pathName){
			 return path.extname(pathName) === this.vmSuffix;
		},
		html : function(pathName){
			 return path.extname(pathName) === '.html';
		},
		cssSuffix: '.css',
		css : function(pathName){
			 return path.extname(pathName) === this.cssSuffix;
		},
		less : function(pathName){
			 return path.extname(pathName) === '.less';
		},
		//这个扩展名比较悲剧
		sass : function(pathName){
			 return path.extname(pathName) === '.scss';
		},
		jsSuffix: '.js',
		js : function(pathName){
			 return path.extname(pathName) === this.jsSuffix;
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
			var reg = new RegExp($.imageFileType()+'$');
			return reg.test(str);
		}
	},
	imageFileType:function(){
		 return 'svg|tiff|wbmp|png|bmp|fax|gif|ico|jfif|jpe|jpeg|jpg|cur';
	},
	/**
	 * @去掉path中的//
	 */
	replaceSlash:function(path){
		 return path.replace(/\/\//gm,'/');
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
* @return 2014-01-14
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
* @return 14:44:553
*/
$.getTime = function(separator, hasMs) {
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
	var result = hour +separator+ mint+separator+ seconds;
	if (typeof(hasMs) != 'undeinfed' && hasMs) {
		result += separator + ms;
	}
	return result;
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


/**
 * @http get
 */
$.httpget = function (host, param){
	var http = require('http');
	if ( typeof(param) == 'undefined'){
		var param = '';
	}

	var options = {
	  host: host,
	  path: param
	};

	var callback = function(response) {
	  var str = '';

	  response.on('data', function (chunk) {
	  	str += chunk;
	  });

	  response.on('end', function () {
	  	//console.log(str);
	  });
	}

	var req = http.request(options, callback);
	req.on('error', function (e) {
	  	//console.log(e);
	});
	req.end();
}

/**
 * @对象merage
 * @last的权重最大
 */

$.merageObj = function(first, last){

//var args = [].slice.call(arguments);
//var j = args.length;
//for (var i=0  ; i < j  ; i++ ){
//	console.log(args[i]);
//}
	if (typeof(first) == 'undefined') {
		var first = {};
	}

	if (typeof(last) == 'undefined') {
		var last = {};
	}

	if (first && last) {
		var i1=0;
		var i2=0;
		for (var i in first){
			i1 += 1;
		}

		for (var i in last){
			i2 += 1;
		}
		
		if (i1==0) {
			return last;
		}

		if (i2==0) {
			return first;
		}

		if (i1>i2) {
			for (var i in last){
				first[i] = last[i];
			}
			return first;
		}else {
			for (var i in first){
				if(!last[i]) last[i] = first[i];
			}
			return last;
		}
	}
}