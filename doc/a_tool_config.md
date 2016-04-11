# 配置文档

config.json需要放在当前项目的根目录下, 详细配置如下：

* `"projectPath": null` - 工程目录前缀
例如下面一段sass代码，经过`jdf output`之后，会在`background`中加上`projectPath`，用来标识这张图片的项目地址。
```css
.list{
	background: url(i/icon.png);
}
```
```css
.list{background:url(http://misc.360buyimg.com/Test/widget/w1/i/icon.png)}
```

* `"host": null` - 远端机器IP

* `"user": null` - 远端机器user

* `"password": null` - 远端机器password

* `"baseDir": ""` - 静态文件名称

* `"cssDir": "css"` - css文件夹名称

* `"imagesDir": "css/i"` - images文件夹名称

* `"jsDir": "js"` - js文件夹名称

* `"htmlDir": "html"` - html文件夹名称

* `"widgetDir": "widget"` - widget文件夹名称

* `"buildDirName": "html"` - 编译的html文件夹名称

* `"outputDirName": "build"` - 输出文件夹名称

* `"outputCustom": null` - 自定义输出文件夹

* `"widgetOutputName": "widget"` - 输出的所有widget合并后的文件名

* `"localServerPort": 80` - 本地服务器端口

* `"configJsonFileContent": configJsonFileContent` - jdf配置文件的默认配置内容
```javascript
var configJsonFileContent{
	"host": "ftpServerIp",
	"user": "anonymous",
	"password": "anonymous",
	"projectPath": ""
}
```

* `"cdn": "http://misc.360buyimg.com"` - 静态cdn域名

* `"newcdn": "http://page.jd.com:81"` - newcdn

* `"serverDir": "misc.360buyimg.com"` - 上传至远端服务器文件夹的名称

* `"previewServerDir": "page.jd.com"` - html文件夹上传至服务器所在的文件夹名称

* `"widgetServerDir": "jdfwidget.jd.com"` - widget服务器所在的文件夹名称

* `"build"`
	* `"jsPlace": "insertBody"` - 调试时js文件位置 insertHead|insertBody
	
	* `"widgetIncludeComment":true` - widget引用带注释
	
	* `"livereload":false` - 是否开启liveload
	
	* `"sass":true` - 是否开启sass编译
	
	* `"less":true` - 是否开启less编译
	
	* `"csslint": false` - 是否开启csslint

	* `"weinre": false` - 是否开启移动设备调试

	* `weinreUrl: "http://123.56.105.44:8080"` - 调试移动设备的服务器地址

* `"output"`
	* `"concat":{}` - 文件合并
	```javascript
	"output":{
		"concat":{
			"js/a_js.js":["js/index.js", "js/index2.js"],
			"css/b_css.css":["css/index.css","css/index2.css"]
		}
	}
	```

	* `"cssImagesUrlReplace": true` - css中图片url加cdn替换
	
	* `"jsPlace": "insertBody"` - 编译后js文件位置 insertHead|insertBody
	
	* `"cssCombo": true` - css进行combo
	
	* `"jsCombo": true` - js进行combo todo

	* `"combineWidgetCss":false` - 合并所有引用的widget中的css
	
	* `"combineWidgetJs":false` - 合并所有引用的widget中的js

	* `"hasBanner": 1` - 压缩后的js和css是否有banner前缀，支持三种形式：`0`，不需要banner；`1`，banner为时间戳的形式，`2`，banner为md5值。
	下面代码示例的第一行注释为时间戳形式的banner
	```css
	/* Test w1.css Date:2015-08-13 15:04:07 */
	.list{background:url(http://misc.360buyimg.com/Test/widget/w1/i/icon.png)}
	```
	下面代码示例的第一行注释为md5值形式的banner
	```css
	/* Test w1.css md5:f4fe4a055715c703557d008daf868c43 */
	.list{background:url(http://misc.360buyimg.com/Test/widget/w1/i/icon.png)}
	```

	* `"vm":true` - 是否开启vm编译
	
	* `"compressJs":true` - 是否开启压缩js文件
	
	* `"compressCss":true` - 是否开启压缩css文件
	
	* `"compressPng":true` - 是否开启压缩png图片

	* `"cssSprite":true` - 是否开启css sprite功能
	
	* `"cssSpriteMode": 1` - 0: 将所有css文件中的背景图合并成一张sprite图片，1: 将每一个widget中的背景图分别合并成一张图片
	
	* `"cssSpriteMargin":10` - css sprite图片之间的间距

	* `base64: false` - 是否对图片进行base64编码
	```css
	background: url(i/icon13.png?__base64) no-repeat center right;
	```
	```css
	background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAUCAMAAABlGZcgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEhQTFRF////yBYj/PHyyyQwzSw4+unq++/vzCYz5I+V5IyS887Q/PT11lBZ2Fhh2V1m1EdS+ebo00VP7ri877q+2Ftkzi868cXJ773BjJeJ4QAAAFJJREFUeNpiYCAIxPgZIUBQGMxn4eEC01wi7GCakRWqkI2RCcyH62SmDV8AzT5eiANY+aB8BIDzORk4UPjcDNxwvihcHuIfcRaobhYhwoEDEGAAD1wBuVXYWesAAAAASUVORK5CYII=) no-repeat center right}
	```

	* `"imagesSuffix": 0`
	0：不添加任何后缀
	1：给css中需要cssSprite的背景图添加后缀，后缀会被添加在文件扩展名的后面。例如：`test.png => test.png?20150319161000`
	2：给css中需要cssSprite的背景图添加后缀，后缀会被添加在文件名的后面，生成一个新的文件。例如：`test.png => test20150319161000.png`

	* `"jsRemove"` - 移除js中函数或者方法,比如console,y.log即配置为['console','y.log']

	* `excludeFiles: null` - 输出时想要过滤的文件/文件夹，目前只支持正则表达式且不要带前后斜杠

* `"widget":`
	* widget预览所依赖的js
	```javascript
	"js":[
		"http://misc.360buyimg.com/jdf/lib/jquery-1.6.4.js",
		"http://misc.360buyimg.com/jdf/1.0.0/unit/base/1.0.0/base.js"
	]
	```

	* widget预览所依赖的css
	```css
	"css":[
		"http://misc.360buyimg.com/lib/skin/2013/base.css"
	]
	```
	
	* `"createFiles":["vm"]` - 新建widget文件夹的文件类型

		