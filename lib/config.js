/**
 * @config
 */
var configContent = '{\r\n'+ 	
'	"host": "ftpServerIp",\r\n'+	
'	"user": "anonymous",\r\n'+
'	"password": "anonymous"\r\n'+
'}';

module.exports = {
	"configFileName": "config.json", //配置文件名称

	"demo": "http://jdf.jd-app.com/download/jdf_demo.tar?true",
	//"jdj": "http://putaoshublog.sinaapp.com/lab/jdf_module/jdj.tar?1",
	//"jdm": "http://putaoshublog.sinaapp.com/lab/jdf_module/jdm.tar?1",

	"cdn": "http://misc.360buyimg.com", //静态cdn域名
	"jsPlace": "bottom", //编译后js文件位置

	"baseDir": "app", //静态文件名称
	"cssDir": "app/css", //css文件夹名称
	"imagesDir": "app/css/i", //images文件夹名称
	"jsDir": "app/js", //js文件夹名称
	"htmlDir": "html", //html文件夹名称
	"widgetDir": "widget", //widget文件夹名称

	"buildDirName": "html", //编译的html文件夹名称
	
	"outputDirName": "build", //输出文件夹名称
	//"widgetOutputName": "widget", //输出的widget文件夹名称

	"outputCustom": null, //自定义输出文件夹

	"projectPath": null, //工程目录前缀
	"host": null, //远端机器IP
	"serverDir": "misc.360buyimg.com", //上传至远端服务器文件夹名称
	"localServerPort": 3000, //本地服务器端口
	"hasBanner": true, //压缩后的js和css是否有banner前缀
	"haslog":true,
	"configContent": configContent
}