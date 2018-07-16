# changelog

## 2.1.51@20180716
* [add] 初始化小程序-项目模板: jdf wx init xxx
* [add] 初始化小程序-项目页面: jdf wx page xxx

## 2.1.50@20180702
* [add] 增加配置，过滤不需要添加js文件id和依赖的文件或文件夹

		build: {
			"isEs6Exclude":"aa\/lib\/|xxx.js"
		}
		
* [add] node-sass更新到最新版本，删除jdf-png-native依赖

## 2.1.44@20170915
* [add]增加jdf cp命令

		output: {
			"cpDirPath": [
				{
					"userRoot": "", // 默认取用户目录
					"sourcePath": "", // 源目录
					"targetPath": "" // 目标目录
				}
			]
		}

## 2.1.43@20170809
* [add]增加zip打包output文件夹 

		output: {
			"zipOutput": true
		}

## 2.1.40@20170419
* [fix]不加cdn前缀 也不加projectPath 即保持默认的路径 的输出

## 2.1.39@20170418
* 增加输出的html文件夹名称配置即  

		"outputHtmlDir": ""

## 2.1.36@20170328
* [add]增加不进行es6编译的文件配置 `build.isEs6Exclude" 

## 2.1.35@20170313
* [fix]BrowserSync merage `localServerPort` config

### 2.1.34@20170308
* [bug]win7下`jdf b`二维码显示不全

### 2.1.32@20170302
* [add]低版本`jdf -v`时增加升级提示


### 2.1.28@20170224
* [add]区分开发环境，预发环境可用`jdf u -prod`，而线上环境可用`jdf u -pub`，那么html中替换字符串可用`output.htmlContentReplaceInProduce`和`output.htmlContentReplaceInPublish`，js中替换字符串可用`output.jsContentReplaceInProduce`和`output.jsContentReplaceInPublish`，config.json相关配置如下：

		"output":{
			"htmlContentReplace":[{"from":"mydomain.xxx.com","to":"all.xxx.com"}],
			"htmlContentReplaceInProduce":[{"from":"mydomain.xxx.com","to":"prod.xxx.com"}],
			"htmlContentReplaceInPublish":[{"from":"mydomain.xxx.com","to":"publish.xxx.com"}],
			"jsContentReplace":[{"from":"mydomain.xxx.com","to":"all.xxx.com"}],
			"jsContentReplaceInProduce":[{"from":"mydomain.xxx.com","to":"prod.xxx.com"}],
			"jsContentReplaceInPublish":[{"from":"mydomain.xxx.com","to":"pub.xxx.com"}]
		}

* [fix]jdf o -nc，jdf o -nh，jdf o -preview功能保留，隐藏其入口

### 2.1.26@20170224
* [add]vm的数据源可以为外部链接 {%widget name="test" data='http://xxx.com/xxx.json'%}

### 2.1.25@20170224
* [fix]uglify-js升级至2.7.5

### 2.1.24@20170224
* [fix]jdf_demo下载地址换成七牛云

### 2.1.23@20170123
* [bug]build.combineWidgetCss bug fix

### 2.1.22@20170119
* [bug]要编译的文件后缀正则fix

### 2.1.21@20170113
* [fix]win7下node v4.2.6 v5.12.0 v6.9.4进行回归测试node-sass和jdf-png-native两个模块，安装正常，node v7.4.0版本暂不支持
* [fix]移除对webpack打包的支持

### 2.1.20@20170111
* [fix]jdf_init修正

### 2.1.19@20170106
* [fix]jdf-sass不再维护，替换为官方的node-sass

### 2.1.18@20170105
* [fix]优化整体JDF帮助文档

### 2.1.13@20161226
* [add]移动优先，`jdf build`时默认在命令行下显示二维码，方便手机扫码调试，关闭方法是增加配置，即配置`build`中的`qrcode`为`false`
* [bug]cdn为空时js路径替换问题修正
* [bug]启动多个项目时server端口号不能逐渐累加
* [fix]jdf output时默认输出html文件夹
* [fix]修正config.json和template/index.html的引用路径

### 2.1.12@20161222

* [bug]fix win7 upload(linux type)

### 2.1.10@20161214

* [add]增加jdf o输出时html和js文件内容替换，比如html中的脚本url或者js中的接口url，即配置`output`中的`htmlContentReplace`和`jsContentReplace`
* [add]jdf server运行时提示当前机器ip和缓存文件路径（受browser-sync的启发，特表感谢）
* [add]提升编译效率，复制文件夹时过滤不需要编译的文件，同时增加配置也可过滤，即配置`build`的`excludeFiles`

### 2.1.9@20161208

* [add]增加编译时server用[browser-sync](https://browsersync.io/)(配置jdf.config.build.hasBrowserSync为true)
* [add]build时是否在cmd里提示编译信息(配置jdf.config.build.hasCmdLog为true)
* [fix]build sass/less时报错增加颜色
* [bug]css编译写内容修正
* [add]支持命令行下把本地文件夹中所有文件上传至外端机器目录@20161205 `jdf u -c ./localDirxxx /serverDirxxx serverIp`

### 2.1.7@2061130
* [add]支持css加autoprefixer，即配置`build`中的`autoprefixer`为`true`
	
### 2.1.6@20161130
* [add]支持直接上传至linux server，server上需要有php环境和receiver.php，即增加`serverType`配置为`linux`
* [bug]https://github.com/putaoshu/jdf/pull/38 对commander.js统一处理相关内容做修正

### 2.1.5@20161128
* [fix]es6项目只处理js文件夹下的入口文件，即配置build.es6Entry，widget目录中的js不会做处理，主要webpack对js文件中require和import暂时只能处理一个

### 2.1.4@20161125
* [bug]webpack入口路径fix by cdwangdongwu

### 2.1.2@20161121
* [fix]server页面适应移动端访问

### 2.1.2@2016-11-27
* [fix]server页面适应移动端访问
* <del>[add]支持用webpack打包es6，入口参数为build.isEs6 && build.es6Entry</del>

### .............这是一个分界线.............

### 2.0.7 / 2016-9-14 10:50:00
* [add]支持图片生成webp格式，并更新相关css图片链接

### 2.0.3 / 2016-7-6 13:50:00
* [bug]修复无法输出类似icon-null.png的文件名称
* [add]支持输出font icon

### 2.0.1 / 2016-4-28 16:39:00
* [add]cssSprite支持水平合并
* [add]可以指定需要合并的widget名称

### 2.0.0 / 2016-4-20 14:26:00
* 发布jdf@2.0.0

### 1.8.42 / 2016-4-11 16:35:00
* [add]jdf build support combo url
* [add]support the CMD
* [add]cssSprite支持rem

### 1.8.4 / 2016-1-20 14:57:00
* [add]支持nodejs5.0
* [fix]基于一个标准jdf工程，重新整理单元测试
* [bug]修复若干`jdf output`css背景图片问题
* [add]支持smarty模版
* [bug]修复使用less @import抛异常的问题

### 1.8.3 / 2016-1-7 21:24:00
* [add]静态服务器增加对字体文件Content-Type的支持
* [fix]jdf u -debug 支持上传sourceMap到预发服务器，方便调试
* [bug]fix "imagesSuffix：true" png path bug

### 1.8.2
* 支持使用ES6语法开发JS

### 1.8.13 / 2015-11-4 10:50:00
* jdf widget -install支持依赖自动下载安装
* jdf output -plain，只解析编译widget、sass，不对文件进行任何替换压缩操作

### 1.8.12 / 2015-9-9 15:55:00
* [bug]jdf处理base64编码抛异常

### 1.8.1 / 2015-9-7 15:37:00
* 修复jdf o -html报错：Not a PNG file

### 1.8.0 / 2015-8-17 15:06:00
* dos2unix换行符问题
* 图片可转换为base64编码
* 可定义输出时要过滤的文件/文件夹

### 1.7.8 / 2015-8-14 10:31:00
* 支持自定义hasBanner的形式：时间戳、md5值
* 支持在pc端调试移动客户端

### 1.7.6 / 2015-8-4 14:43:00
* 支持css hack
* 优化node-sass、node-pngquant-native、ws三个组件，提高下载速度

### 1.7.1 / 2015-6-17 17:36:00
* 支持编译gbk编码的文件
* 支持自定义cdn

### 1.7.0 / 2015-6-15 16:43:00
* [fix]升级部分组件的版本
* [fix]根据官方用法，修正node-sass的调用方式
* [bug]修复jdf server抛异常问题

### 1.6.8 / 2015-3-17 14:18:00
* [fix]可以给cssSprite后的图片加时间戳，并可自定义形式
* [fix]修改cssSpriteMode参数的默认值
* [bug]修复widget引用逻辑问题
* [bug]删除build文件夹的逻辑问题
* [bug]修复widget引用css/i图片的路径问题

### 1.6.7 / 2015-3-12 11:35:00
* [bug]修复某些项目无法上传的问题
* [add]cssSprite可以自定义合并方式
* [fix]多线程优化

### 1.6.6 / 2015-1-28 13:59:00
* [bug]修复cssSprite合并重名图片会发生错误的问题
* [bug]修复jdf server访问非html，css，js文件抛异常的问题
* [bug]修复jdf o/jdf u可以对单独文件进行操作
* [add]添加jdf compress压缩html功能
* [fix]优化combo文件合并方式
* [fix]优化widget的解析方式

### 1.6.5 / 2014-12-24 16:53:00
* [add]添加支持combo路径映射
* [add]jdf output时可以去除html文件中的注释
* [bug]修复widget的判断逻辑问题
* [bug]是否为图片url正则判断
* [fix]替换jdf demo下载地址 2014-12-29
* [fix]widget中css combo时路径精简
* [fix]Clean-css module disable aggressive merging of properties 2015-1-21

### 1.6.4 / 2014-12-16 15:39:00
* [add]压缩使用多线程，减少多文件项目压缩时间

### 1.6.34 / 2014-12-15
* [add]上传服务器逻辑分拆成独立文件
* [add]支持上传单个html文件至预览服务器即'jdf upload html/a.html -preview'

### 1.6.33 / 2014-12-12 14:20
* [bug]serve端口占用时累加计算出错
* [bug]mac下首次运行时报错'env: node\r: No such file or directory'
* [fix]'jf install init'文档更新

### 1.6.3 / 2014-12-10
* [add]jdf文档迁移至doc文件夹

### 1.6.2 / 2014-12-5 16:08:00
* [fix]'i/a.png'和'http://cdn/i/a.png' css路径替换修正

### 1.6.19 / 2014-12-4 17:07:00
* [fix]'jdf widget -create'时css修正为scss文件

### 1.6.18 / 2014-12-4 16:50:00
* [bug]修正输出时出现"app/css/i"图片路径问题

### 1.6.17 / 2014-11-28 11:39:00
* [bug]修正输出时出现"/css/css/i"图片路径问题
* [fix]修正livereload配置默认为false

### 1.6.16 / 2014-11-13 11:13:00
* [bug]修复cssSprite路径合并缺少css目录的问题

### 1.6.15 / 2014-11-13 10:43:00
* [bug]修复cssSprite路径合并问题
* [bug]修复buildWidget在某些情况会抛非法正则表达式的异常

### 1.6.14 / 2014-11-11 15:58:00
* [bug]输出时删除了html/images

### 1.6.12 / 2014-11-01 13:23:00
* [add]文件格式化功能
* [fix]将原来的htmllint、csslint、jslint合并为一个lint命令
* [bug]修复csssprite遇到未知图片不能合并的问题

### 1.6.11 / 2014-10-29 14:06:00
* [fix]livereload下修改css/scss/less不刷新页面
* [fix]执行jdf output时，会将widget/images全部复制到html/images中

### 1.6.0 / 2014-10-22 13:55:00
* [fix]模块云服务器地址切换并增加配置

### 1.5.93 / 2014-10-21 18:50:00
* [bug]vm中"parse"依赖的js/css路径修正

### 1.5.92 / 2014-10-16 15:32:00
* [bug]css_sprite背景图片路径修正

### 1.5.9 / 2014-10-14 10:02:00
* [bug]build css include uniq
* [fix]mkdir before css sprite

### 1.5.8 / 2014-10-10 11:41:00
* [add]jdf htmllint
* [fix]widget位置build和output时默认置于页面底部

### 1.5.7 / 2014-9-29 17:02:00
* [fix]widget编译取编译文件夹内所有文件
* [fix]一般引用的js/css路径加前缀修正
* [bug]seajs.use路径加前缀修正

### 1.5.6 / 2014-9-24 17:43:00
* [add]增加文件合并功能
* [fix]js combo

### 1.5.5 / 2014-9-22 16:56:00
* [add]!!!widget支持版本号下载和发布

### 1.5.3 / 2014-9-6 20:56:00
* [bug]无cdn时widget路径替换容错

### 1.5.2 / 2014-8-26 15:55:00
* [add]widget引用在注释后不起作用
* [ue]项目没有配置文件增加提示

### 1.5.0 / 2014-8-25 17:30:00
* [add]在当前文件夹下编译less/scss,同时会生成css,也放在当前文件夹下,即执行jdf build -css

### 1.4.9 / 2014-8-25 10:30:00
* [add]js压缩支持配置去除console,即配置文件中output的jsRemove参数
* [fix]png压缩插件升级

### 1.4.8 / 2014-8-22 15:34:00
* [add]vm模板支持嵌套,语法: #parse("../test/test.vm"),作用:引入test widget的vm,js和css

### 1.4.7 / 2014-8-14 11:03:00
* [add]输出图片增加时间戳后缀配置

### 1.4.6 / 2014-8-11 13:43:00
* [add]jdf widget -create时文件类型可选择
* [add]jdf install init时加上meta,keyword和默认jdf介绍方案
* [fix]jdf.upload配置错误增加提示

### 1.4.5 / 2014-8-7 13:07:00
* [bug]widget中样式引用图片为css文件夹中图片输出路径有误
* [bug]生成的config.json格式有误

### 1.4.4 / 2014-8-6 19:18:00
* [fix]css输出debug模块图片前缀未替换

### 1.4.3 / 2014-8-4 17:16:00
* [add]js/css输出时增加combo配置项
* [bug]css sprite输出的路径未加cdn

### 1.4.2 / 2014-8-4 10:40:00
* [bug]css/js文件内容为空时页面会引用此文件

### 1.4.1 / 2014-8-1 16:11:00
* [bug]css内容为空sass编译会报错

### 1.4.0 / 2014-7-29 13:38:00
* [fix]$.httpget增加延时处理

### 1.3.9 / 2014-7-25 17:22:00
* [update]node-sass升级至0.9.3,解决css expression的问题

### 1.3.8 / 2014-7-23 15:27:00
* [new]增加newcdn参数：不需要配置cdn的host即可预览页面，通过 `jdf upload -nc` 可上传css/js至serverDir，通过 `jdf upload -nh` 可上传html至previewServerDir，同时cdn会被替换成newcdn

### 1.3.7 / 2014-7-11 16:15:00
* [new]增加csslint功能：jdf csslint或者通过config.json中build.csslint开头设置

### 1.3.61 / 2014-7-6 18:57:21
* [fix]本地server前后台文件同步，增加删除文件状态同步

### 1.3.6 / 2014-7-5 07:54:00
* [new]!!!增加css sprite图片合并功能
* [new]文档更新：项目路径转换，css sprite
* [bug]本地server中断退出：未绑定error引起
* [bug]删除文件夹时报错：win/mac系统提示有权限问题时，保留nodejs原生错误提示
* [fix]output.js引入promises模块Q，同时优化代码结构
* [fix]log和command前后顺序调整

### 1.3.5 / 2014-6-27 15:40:00
* [new]增加jslint js代码检查功能，即jdf jslint或者 jdf jslint js文件名/文件夹名

### 1.3.4 / 2014-6-23 10:38:00
* [new]自动生成widget模块目录 即jdf widget -create name
* [new]获取服务端widget模块列表 即jdf widget -list
* [new]增加配置项widget预览时依赖的js和css
* [fix]widget预览/安装/发布去除widget文件前缀,使用更方便

### 1.3.27 / 2014-6-17 17:19:00
* [bug]自定义输出文件夹未正确输出

### 1.3.25 / 2014-6-9 23:32:00
* [fix]getProjectPath默认取当前文件夹名称
* [bug]输出的图片文件夹为cssi，应该为css/i

### 1.3.24 
* [bug]server返回上一层文件夹异常,直接回到根目录
* [fix]本地服务器支持映射combo文件v1.0
* [fix]编译时widget文件位置增加配置项:底部或者尾部

### 1.3.23 / 2014-6-5 14:50:00
* [bug]clean-css v2.1.0版压缩亦是有导常即#extra-0压缩后为#extra0,现升级至最新2.1.8

### 1.3.22 / 2014-6-4 15:10:00
* [bug]本地服务器404返回header头错误

### 1.3.21 / 2014-6-2 21:59:10
* [new]!!!本地服务器支持映射线上cdn路径:即本地项目有文件则从本地取文件,如果本地没有,则从cdn上取
* [fix]配置文件本地服务器端口3000修改为80

### 1.3.2 / 2014-5-24 8:28:00
* [new]!!!支持静态资源不加CDN输出:适应于后台系统,静态资源不放CDN而放在后端系统中
* [new]widget引用的js文件打包时增加配置:默认不打包合并
* [new]widget引用的css文件打包时增加配置:默认打包合并所有引用到的css文件
* [new]单个widget增加引用时配置-是否带引入路径注释,解决widget为header时,DOCTYPE前有注释内容,文档会解析成BackCompat模式
* [new]tpl/vm内的css/js url加前缀
* [new]增加$.uniq数组去重;重构$.merageObj;
* [bug]Mac svn下的项目,删除文件时由于系统权限问题会出现异常

### 1.3.18 / 2014-5-22 13:14:35
* [bug]项目文件夹无html时无法output

### 1.3.17 / 2014-5-14 10:51:27
* [bug]在body引用字符串无body结束符时未正确引入
* [add]增加配置:引用widget时是否带上文件路径注释

### 1.3.16 / 2014-5-9 11:21:48
* [fix]压缩JS修正:对象键值默认不加引号;删除函数声明至顶端配置

### 1.3.15 / 2014-5-8 19:44:13
* [new]支持多个项目同时编译
* [fix]如果有两个进程那么第二个进程的livereload功能被关闭

### 1.3.13 / 2014-5-8 14:27:14
* [new]配置文件增加build和output功能增加开关
* [new]output逻辑拆分成独立文件
* [fix]优化主函数,提升性能
* [bug]模板编译传type参值失效

### 1.3.12 / 2014-5-7 17:07:20
* [new]输出的html文件夹可上传至服务端预览文件夹
* [bug]win7下打开build文件夹查看时删除报错

### 1.3.11 / 2014-5-6 00:03
* [new]输出引用widget图片时加CDN前缀

### 1.3.1 / 2014-5-4 17:59:35
* [new]支持Livereload
* [new]支持页面内seajs.use引用加前缀

### 1.3.0 / 2014-4-25 14:34:28
* [new]初始化项目配置文件增加默认配置信息
* [new]编译时JS文件放在页面底部
* [bug]写文件出错时会退出node进程
* [bug]非项目文件夹/文件会复制至后台
* [fix]build widget/css两个分离成独立模块

### 1.2.94 / 2014-4-22 16:17:05
* [new]支持java volicity即vm模板

### 1.2.93 / 2014-4-16 14:01:32

* widget输出方案确定:在widget文件夹中增加i文件夹,输出时把i文件夹复制至css文件夹下
* 更新readme.md
* 修正cdn前缀

### 1.2.9 / 2014-4-2 18:15:25

* 压缩图片bug修正
* 修正统计日志

### 1.2.8 / 2014-3-28 16:35:05

* 支持widget模块单独预览调试
* 增加简单的日志统计
* 增加本地server显示ip,方便联调
* 修正构建widget的函数

### 1.2.61 / 2014-3-25 13:38:37

* 支持单独引入widget的js和css
* css图片路径修正

### 1.2.6 / 2014-3-21 11:34:02

* 支持多个html生成自己的widget，并可以配置

### 1.2.5 / 2014-3-19 16:51:14

* 增加调试模式是否开启压缩选项(js部分)

### 1.2.3 / 2014-3-19 16:51:14

* 增加调试模式是否开启压缩选项(css部分)
* 工程build增加-open选项，直接打开浏览器访问当前工程
* 优化本地server目录浏览显示，并支持中文文件名预览
* 增加配置项目压缩后的js和css是否有banner
* widget编译规则修正

### 1.2.2 / 2014-3-18 15:23:04

* 支持备份工程文件至tags目录
* 增加本地服务器端口配置项
* 增加自定义输出文件夹配置项

### 1.2.0 / 2014-3-16 14:00:00

* 支持本地widget上传至服务端
* 支持下载widget到当前工程
* js依赖管理: 支持use和require取文件ID和提取依赖数组dependencies
* 本地server支持目录浏览
* 优化上传体验

### 1.1.9 / 2014-3-12 15:21:09

* 支持widget本地预览
* js压缩增加容错处理
* less，sass编译增加容错处理
* css加cdn正则修正

### 1.1.8 / 2014-3-11 18:10

* 支持widget中文件夹编译less，scss
* 支持清除项目缓存文件夹功能
* 压缩js文件require写在注释会被依赖的bug

### 1.1.7 / 2014-3-9 18:10

* 支持页面所有同域名下css链接生成combo格式
* 支持所有的widget的css和js合并
* 优化函数和名字

### 1.1.6 / 2014-3-9 09:51

* 内置png图片压缩插件，支持将png24压缩为png8
* 支持/*$ ... */注释保留在输出文件中
* 支持保留require，define不被会替换
* 压缩模块拆分独立文件

### 1.1.5 / 2014-3-7 18:00

* 支持sass即时编译
* 支持下载线上tar文件，并解压
* 支持输出配置项文件夹
* 支持引入外部公共模块
* 支持通过配置文件传参
* 优化输出和复制文件逻辑，提升性能
* 优化测试用例文件
* 优化示例项目
* JS压缩修正
* 提示jdj和jdm模块下载地址
* 提供示例项目下载地址
* 完善自定义输出逻辑

### 1.1.4 / 2014-3-6 19:46
* 支持less即时编译

### 1.1.1 / 2014-3-3 09:30
* 优化上传运端服务器模块，支持linux，windows服务器
* 成功，错误，提示方案修正
* 完善容错提示信息

### 1.1.0 / 2014-2-28 10:00:00
* 支持上传到远端服务器
* 入口命令名称优化
* 书写README
* f.copy方法重构

### 0.0.8 / 2014-2-23 21:06:24

* js文件中require依赖处理
* css文件中图片url加cdn前缀和时间戳后缀
* html文件中css和js的路径替换为cdn域名前缀

### 0.0.4 / 2014-2-17 10:51:04

* 支持css和js文件夹压缩
* 生成标准化的项目文件夹
* 确立核心流程，即支持本地，联调，线上三种模式

### 0.0.1 / 2014-1-24 10:24:00

* 首次提交至npm
* widget中相关连的css，js文件引入，合并，打包
* widget中html，css模块引入
* 初步的远程版本交互和管理
* 本地server
* 本地变更的文件或文件夹自动传至本地server文件夹

