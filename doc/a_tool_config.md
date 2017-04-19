# 配置文件文档

config.json详细配置如下：
	
* `"projectPath": null` 工程目录前缀
* `"localServerPort": 3000` 本地服务器端口
* `"baseDir": ""` 输出后的项目名称
* `"cssDir": "css"` css文件夹名称
* `"imagesDir": "css/i"` images文件夹名称
* `"jsDir": "js"` js文件夹名称
* `"htmlDir": "html"` html文件夹名称
* `"widgetDir": "widget"` widget文件夹名称
* `"buildDirName": "html"` 编译的html文件夹名称
* `"outputDirName": "build"` 输出文件夹名称
* `"outputHtmlDir": null` 输出的html文件夹名称
* `"outputCustom": null` 自定义输出文件夹
* `"widgetOutputName": "widget"` 输出的所有widget合并后的文件名
* `"widgetInputName": []` 指定需要输出的widget名称
* `"cdn": "http://misc.360buyimg.com"` 静态cdn域名
* `"newcdn": "http://page.jd.com:81"` newcdn
* `"previewServerDir": "page.jd.com"` html文件夹上传至服务器所在的文件夹名称
* `"widgetServerDir": "jdfwidget.jd.com"` widget服务器所在的文件夹名称
* `"configJsonFileContent": {}` jdf配置文件的默认配置内容
* `"host": null` 远端机器IP
* `"user": null` ftp模式远端机器user
* `"password": null` ftp模式远端机器password
* `"serverDir": "misc.360buyimg.com"` 上传至远端服务器文件夹的名称
* `"serverType": 'ftp'` 默认为ftp上传，传值为linux时直接上传
	
	* 直接上传

	```javascript
	"host": "172.xxx.xxx.xxx",
	"serverDir": "/export/App/xxx.com/",
	"serverType": "linux"
	```
	* ftp上传

	```javascript
	"host": "172.xxx.xxx.xxx" 
	"user": "user" 
	"password": "password"
	"serverType": 'ftp'
	```

	* 相关上传命令

	```javascript
	jdf u (上传js/css/widget)
	jdf u -h (上传js/css/widget/html)
	jdf u -c ./dist (自定义上传dist文件夹)
	```
* `"build"`	
	* `"jsPlace": "insertBody"` 调试时js文件位置 insertHead|insertBody
	* `"widgetIncludeComment":true` widget引用带注释
	* `"livereload":false` 是否开启liveload
	* `"sass":true` 是否开启sass编译
	* `"less":true` 是否开启less编译
	* `"csslint": false` 是否开启csslint
	* `"weinre": false` 是否开启移动设备调试
	* `"weinreUrl": "http://123.56.105.44:8080"` 调试移动设备的服务器地址
	* `"autoprefixer": false` 是否开启css加autoprefixer
		* autoprefixer的默认options如下：
		
		```javascript
		"build":{
			"autoprefixerOptions":{
				"browsers": ["last 2 version", 'Android >= 4.0'],
		    	"cascade": true,
		    	"remove":true
			}
		}
		```
		* autoprefixer官网https://github.com/postcss/autoprefixer#autoprefixer
		* browsers可参考https://github.com/ai/browserslist#queries
	* `"hasCmdLog":false` build时是否在cmd里提示编译信息
	* `"hasBrowserSync":false` 用BrowserSync做为server
	* `"excludeFiles":null` 对要编译的文件/文件夹进行过滤
	* `"isEs6":true` 对js文件进行es6编译
	* `"qrcode":true` 命令行下是否显示二维码图片
* `"output"`
	* `"cssImagesUrlReplace": true` css中图片url加cdn替换
	* `"jsUrlReplace": false` js文件的id和dependences是否添加cdn前缀
	* `"jsPlace": "insertBody"` 编译后js文件位置 insertHead|insertBody
	* `"cssCombo": true` css进行combo
	* `"jsCombo": true` js进行combo todo
	* `"combineWidgetCss":false` 合并所有引用的widget中的css
	* `"combineWidgetJs":false` 合并所有引用的widget中的js
	* `"jsRemove"` 移除js中函数或者方法,比如console,y.log即配置为['console','y.log']
	* `"excludeFiles": null` 输出时想要过滤的文件/文件夹，目前只支持正则表达式且不要带前后斜杠
	* `"vm":true` 是否开启vm编译
	* `"compresshtml":false` 是否开启压缩html文件
	* `"compressJs":true` 是否开启压缩js文件
	* `"compressCss":true` 是否开启压缩css文件
	* `"compressPng":true` 是否开启压缩png图片
	* `"cssSprite":true` 是否开启css sprite功能
	* `"cssSpriteMode": 1` 0: 将所有css文件中的背景图合并成一张图片，1: 将每一个widget中的背景图分别合并成一张图片
	* `"cssSpriteMargin": 10` css sprite图片之间的间距
	* `"cssSpriteDirection": vertical` vertical：垂直合并，horizontal：水平合并
	* `"base64": false` 是否对图片进行base64编码，如果为true，并且图片后缀为?__base64，则进行base64编码	
	* `"concat":{}` 文件合并，多个文件合成一个
		
		```javascript
		"output":{
			"concat":{
				"js/a_js.js":["js/index.js", "js/index2.js"],
				"css/b_css.css":["css/index.css","css/index2.css"]
			}
		}
		```
	* `"hasBanner": 1` 压缩后的js和css是否有banner注释前缀
		* 支持三种形式：`0`，不需要banner；`1`，banner为时间戳的形式，`2`，banner为md5值
		* 下面代码示例的第一行注释为时间戳形式的banner
		
		```css
		/* Test w1.css Date:2015-08-13 15:04:07 */
		.list{background:url(http://1.png)}
		```
		* 下面代码示例的第一行注释为md5值形式的banner
		
		```css
		/* Test w1.css md5:f4fe4a055715c703557d008daf868c43 */
		.list{background:url(http://1.png)}
		```
	* `"imagesSuffix": 0`
		
		* 0：不添加任何后缀
		* 1：给css中需要cssSprite的背景图添加后缀，后缀会被添加在文件扩展名的后面。例如：`test.png => test.png?20150319161000`
		* 2：给css中需要cssSprite的背景图添加后缀，后缀会被添加在文件名的后面，生成一个新的文件。例如：`test.png => test20150319161000.png`

	* `"htmlContentReplace": []` 输出时html文件内容替换
		
		```javascript
		"output":{
		  	"htmlContentReplace":[
			  	{
					"from":"../../../",
					"to":"//xxx.com/"
				},
				{
					"from":"xxx.test",
					"to":"'xxx.com"
				}
			]
		}
		```
	* `"jsContentReplace": []` 输出时js文件内容替换
		
		```javascript
		"output":{
			"jsContentReplace":[
				{
					"from":"api.xxx.test",
					"to":"api.xxx.com"
				}
			]
		}
		```
* `"widget":`
	* widget预览所依赖的js
	```javascript
	"js":[
		"//misc.360buyimg.com/jdf/lib/jquery-1.6.4.js",
		"//misc.360buyimg.com/jdf/1.0.0/unit/base/1.0.0/base.js"
	]
	```
	* widget预览所依赖的css
	```css
	"css":[
		"//misc.360buyimg.com/jdf/1.0.0/unit/ui-base/1.0.0/ui-base.css"
	]
	```

		