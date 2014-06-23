/**
 * @统一配置文件
 */

/**
 * @config Json File Content
 */
var configJsonFileContent = '{\r\n'+ 	
'	"host": "ftpServerIp",\r\n'+	
'	"user": "anonymous",\r\n'+
'	"password": "anonymous"\r\n'+
'}';

module.exports = {
	"demo": "http://jdf.jd-app.com/download/jdf_demo.tar?true",//demo示例url
	//"jdj": "http://putaoshublog.sinaapp.com/lab/jdf_module/jdj.tar?1",
	//"jdm": "http://putaoshublog.sinaapp.com/lab/jdf_module/jdm.tar?1",

	"configFileName": "config.json", //配置文件名称
	"baseDir": "", //静态文件名称
	"cssDir": "css", //css文件夹名称
	"imagesDir": "css/i", //images文件夹名称
	"jsDir": "js", //js文件夹名称
	"htmlDir": "html", //html文件夹名称
	"widgetDir": "widget", //widget文件夹名称
	"buildDirName": "html", //编译的html文件夹名称
	
	"outputDirName": "build", //输出文件夹名称
	"outputCustom": null, //自定义输出文件夹
	"widgetOutputName": "widget", //输出的所有widget合并后的文件名

	"projectPath": null, //工程目录前缀
	"localServerPort": 80, //本地服务器端口
	"haslog":true,
	"configJsonFileContent": configJsonFileContent,
	
	"host": null, //远端机器IP
	"user": null, //远端机器user
	"password": null, //远端机器password
	"cdn": "http://misc.360buyimg.com", //静态cdn域名
	"serverDir": "misc.360buyimg.com", //上传至远端服务器文件夹的名称
	"previewServerDir": "preview.jd.com", //html文件夹上传至服务器所在的文件夹名称
	
	build:{
		jsPlace: "insertHead", //调试时js文件位置 insertHead|insertBody
		widgetIncludeComment:true,//widget引用带注释
		livereload:true, //是否开启liveload
		sass:true,//是否开启sass编译
		less:true//是否开启less编译
	},

	output:{
		cssImagesUrlReplace: true,//css中图片url加cdn替换
		jsPlace: "insertHead", //编译后js文件位置 insertHead|insertBody
		cssCombo: true, //css进行combo
		//jsCombo: true, //js进行combo todo
		combineWidgetCss:true,//合并所有引用的widget中的css
		combineWidgetJs:false,//合并所有引用的widget中的js
		hasBanner: true, //压缩后的js和css是否有banner前缀
		vm:true, //是否开启vm编译
		compressJs:true,//是否开启压缩js文件
		compressCss:true,//是否开启压缩css文件
		compressPng:true//是否开启压缩png图片
	},

	widget:{
		//widget预览所依赖的js
		js:[
			'http://misc.360buyimg.com/jdf/lib/jquery-1.6.4.js',
			'http://misc.360buyimg.com/jdf/1.0.0/unit/base/1.0.0/base.js'
		],
		//widget预览所依赖的css
		css:[
			'http://misc.360buyimg.com/lib/skin/2013/base.css'
		]
	}
}