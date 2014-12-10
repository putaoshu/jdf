#项目路径转换说明

##编译输出
* 页面中css和js的引用路径一般情况如下
	* 建议的路径为

			/css/index.css

	* 也可设置成相对路径
		
			../css/index.css

* 执行jdf output，输出
	* 默认会转换为
		
			{{cdn}}{{projectPath}}/css/index.css
		
	* 如果config.json中cdn为空，即静态资源无需上传至cdn，转换成
		
			{{projectPath}}/css/index.css

	* 如果config.json中cdn和projectPath都为空，转换成
		
			../css/index.css

##联调
* 上传静态css/js文件
	* {{build}} 为编译输出的文件夹，包括要上线的css/js/widget文件夹
	* 执行 `jdf upload` 可把本地{{build}}上传至{{host}}机器下，文件夹/home/{{user}}/{{serverDir}}/下
	* 联调机器为145的话，可在浏览器上可通过 http://misc.360buyimg.com/{{projectPath}} 预览访问
* 上传预览html文件夹
	* 执行 `jdf upload -preview` 可把本地{{build}}上传至{{host}}机器下，文件夹/home/{{user}}/{{previewServerDir}}//下
	* 联调机器为145的话，可在浏览器上可通过 http://page.jd.com/{{projectPath}} 预览访问

##说明
* {{cdn}}、{{projectPath}}、{{user}}、{{serverDir}}、{{previewServerDir}}为配置文件config.json相对应的键值
* 如{{projectPath}}为config.json中projectPath的键值

