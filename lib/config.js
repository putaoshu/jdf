/**
 * @统一配置文件
 */

/**
 * @config Json File Content
 */
var configJsonFileContent = '{\r\n'+ 	
'	"host": "ftpServerIp",\r\n'+	
'	"user": "anonymous",\r\n'+
'	"password": "anonymous",\r\n'+
'	"projectPath": ""\r\n'+
'}';

module.exports = {
	//"threads":4, 多线程
	//"isbackup":true,
	//"backupPath":"d:/ppa",

	"demo": "http://putaoshu.github.io/jdf/download/jdf_demo.tar?true",//demo示例url
	//"jdj": "http://putaoshublog.sinaapp.com/lab/jdf_module/jdj.tar?1",
	//"jdm": "http://putaoshublog.sinaapp.com/lab/jdf_module/jdm.tar?1",

	"configFileName": "config.json", //配置文件名称

	"projectPath": null, //工程目录前缀
	
	"host": null, //远端机器IP
	"user": null, //远端机器user
	"password": null, //远端机器password

	"baseDir": "", //静态文件名称
	"cssDir": "css", //css文件夹名称
	"imagesDir": "css/i", //images文件夹名称
	"jsDir": "js", //js文件夹名称
	"htmlDir": "html", //html文件夹名称
	"widgetDir": "widget", //widget文件夹名称
	"buildDirName": "html", //编译的html文件夹名称
	
	"outputDirName": "build", //输出的目标文件夹名称
	"outputCustom": null, //输出的源文件夹名称
	"widgetOutputName": "widget", //输出的所有widget合并后的文件名

	"localServerPort": 80, //本地服务器端口
	"haslog":true,
	"configJsonFileContent": configJsonFileContent,
	
	"cdn": "http://misc.360buyimg.com", //静态cdn域名
	"newcdn": "http://page.jd.com:81", //newcdn

	"serverDir": "misc.360buyimg.com", //上传至远端服务器文件夹的名称
	"previewServerDir": "page.jd.com", //html文件夹上传至服务器所在的文件夹名称
	"widgetServerDir": "jdfwidget.jd.com", //widget服务器所在的文件夹名称

	"build":{
		"jsPlace": "insertBody", //调试时js文件位置 insertHead|insertBody
		"widgetIncludeComment":true,//widget引用带注释
		"livereload":false, //是否开启liveload
		"sass":true,//是否开启sass编译
		"less":true,//是否开启less编译
		"csslint":false,//是否开启csslint

		"weinre": false, //是否开启移动设备调试
		"weinreUrl": "http://123.56.105.44:8080"//调试移动设备的服务器地址
	},

	"output":{
		"concat": {},//文件合并

		"cssImagesUrlReplace": true,//css中图片url加cdn替换
		"jsUrlReplace": false,//js文件的id和dependences是否添加cdn前缀
		"jsPlace": "insertBody", //编译后js文件位置 insertHead|insertBody
		"cssCombo": true, //css进行combo
		"jsCombo": true, //js进行combo todo

		"combineWidgetCss":false,//合并所有引用的widget中的css
		"combineWidgetJs":false,//合并所有引用的widget中的js

		"hasBanner": 1, //定义js和css的banner前缀形式。0，不需要；1，时间戳；2，md5值
		"vm": true, //是否开启vm编译
		"compresshtml": false,//是否开启压缩html文件
		"compressJs": true,//是否开启压缩js文件
		"compressCss": true,//是否开启压缩css文件
		"compressPng": true,//是否开启压缩png图片
		"compressPngReg": null,//是否压缩此参数匹配的文件

		"comment": true,//是否输出文件中的注释

		"cssSprite": true, //是否开启css sprite功能
		"cssSpriteMode": 1, //0: 将所有css文件中的背景图合并成一张sprite图片，1: 将每一个widget中的背景图分别合并成一张图片
		"cssSpriteMargin": 10, //css sprite图片之间的间距

		"base64": false, //是否对图片进行base64编码

		"imagesSuffix": 0,
		/*0：不添加任何后缀
		  1：给css中需要cssSprite的背景图添加后缀，后缀会被添加在文件扩展名的后面。例如：test.png => test.png?20150319161000
		  2：给css中需要cssSprite的背景图添加后缀，后缀会被添加在文件名的后面，生成一个新的文件。例如：test.png => test20150319161000.png
		*/

		"jsRemove": [],//移除js中函数或者方法,比如console,y.log即配置为['console','y.log']
		"excludeFiles": null,//对输出的文件/文件夹进行过滤
		"encoding": "utf-8"//指定项目的编码格式：utf-8，gbk
	},

	"widget":{
		//widget预览所依赖的js
		"js": [
			"http://misc.360buyimg.com/jdf/lib/jquery-1.6.4.js",
			"http://misc.360buyimg.com/jdf/1.0.0/unit/base/1.0.0/base.js"
		],
		//widget预览所依赖的css
		"css": [
			"http://misc.360buyimg.com/lib/skin/2013/base.css"
		],
		//新建widget文件夹的文件类型
		"createFiles": ["vm"]
	},

	"babel": {
		// 默认只启用基本转义 http://babeljs.io/docs/plugins/preset-es2015/
		"defaultPresets": ["es2015"],
		// 兼容IE6,7,8
		"defaultPlugins": ["transform-es3-member-expression-literals", "transform-es3-property-literals"]
	}
}