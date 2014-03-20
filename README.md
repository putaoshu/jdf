# jdf

[![NPM version](https://badge.fury.io/js/jdf.png)](http://badge.fury.io/js/jdf)

[![NPM](https://nodei.co/npm/jdf.png?downloads=true)](https://nodei.co/npm/jdf/)

## 关于

* jdf --- 前端开发集成解决方案，合理，快速和高效的解决前端开发中的工程和项目问题

## 功能介绍

* 完美支持windows、mac、linux等系统
* 支持本地，联调，线上三种开发流程
* 支持公共widget的引用，预览，安装和发布
* 可生成标准化的项目文件夹
* 支持给所有静态资源添加CDN域名前缀或后缀戳
* 支持css引用的所有链接生成combo格式
* 支持文件夹或者单独文件css和js文件压缩
* 支持less，sass即时编译
* 支持cmd模块自动提取文件id和dependencies，压缩时保留require关键字
* 支持备份当前工程文件
* 支持通过配置文件传参构建项目
* 内置png图片压缩插件，支持将png24压缩为png8
* 内置本地开发调试服务器，支持html和静态文件预览，以及当前目录浏览
* 支持文件监听，保存后文件即可在浏览器即时预览
* 支持上传到远端服务器，利用文件监听，即实现本地文件保存后可上传至远端服务器
* 编码统一化，即无论当前文件格式是gbk，gb2312，utf8，utf8-bom，统一输出utf8
* 多条命令，可满足不同的开发需求
* [todo]内置css sprites
* [todo]支持css中图片地址自动加md5版本戳

## 安装

* jdf基于nodejs
	* 下载地址 [nodejs](http://nodejs.org/download/)
* 安装jdf
	* npm install jdf **-g** --save-dev

## 快速入门和应用举例

* 新建工程目录
	* 在svn主干上新建分支，名称为testitem，比如svn根目录/product/index/branches/testitem
	* 或者直接在主干新建项目文件夹，比如svn根目录/product/index/trunk/
	* 或者在某个目录新建项目文件夹，同时配置projectPath
* 初始化工程目录
	* 从命令行下进入当前目录
	* 执行 jdf install init，生成标准化的项目文件夹
* 项目开发
	* 在html，app/js/，app/css/等文件夹中新建相应文件
	* 在widget文件夹新建规划抽离好的widget模块
* 项目本地调试
	* jdf build 在浏览器中查看构建后的当前工程，包括less，sass编译，widget编译等
	* jdf release 在浏览器中查看release后的工程，包括所有widget中js，css合并后效果
* 项目输出
	* jdf output 输出项目文件夹，包括压缩合并后的css，js，images，静态资源加cdn前缀，同时压缩所有png图片
	* jdf output -html 输出项目文件夹时包括了html文件夹，供联调使用
	* jdf output app/js/test.js，app/css 自定义输出自己需要的文件或文件夹
* 项目联调和发布
	* jdf upload 发布至远端机器，供产品，设计师查看效果，以及后端工程师联调
* 项目备份
	* jdf output -backup 备份app目录至tags文件夹，供和已线上版本对比
	
## widget命令使用介绍

* widget -preview name 预览一个widget模块
* widget -install name 安装一个widget模块到当前工程
* widget -publish name 发布一个widget模块

## widget模块依赖介绍

* widget模块是为了解决开发多个页面中有相同html结构，一页多屏html代码上等等问题。
* 引入类型：html，css，images
* 引入方式

		{%widget name="test"%}
    
* 开发目录

		widget/
	        widget/test/
	        widget/test/test.html
	        widget/test/test.css
	        widget/test/test.js
	        widget/test/test.png

* 本地测试输出

		<!-- js,css -->
		<link type="text/css" rel="stylesheet"  href="/widget/tes/tes.css" source="widget"/>
		<script type="text/javascript" src="/widget/tes/tes.js" source="widget"/></script>

		<!-- tpl -->
		<div class="test">this is test</div>

* 编译输出
	* 所有widget模块中css文件合并为widget.css
	* 所有widget模块中js文件合并为widget.js
	* 所有widget模块中images文件输出对应至目录

## 配置文档

* config.json需要放在项目根目录下, 可配置项如下：

		{
			"cdn":"http://www.cdn.com", 
			"jsPlace":"bottom",
	
			"baseDir" : "app",
			"cssDir" : "app/css",
			"imagesDir" : "app/css/i",
			"jsDir" : "app/js",
			"htmlDir" : "html",
			"widgetDir" : "widget",
	
			"buildDirName" : "html",
			"outputDirName:" : "build",
			"outputCustom:" : "a/,b/",
	
			"projectPath" : "product/index/",
			"host" : "192.168.1.1",
			"serverDir" : "cdndir",
			"localServerPort" : "3000" 
		}
	
* 具体说明如下:

		cdn:'http://www.cdn.com', //静态cdn域名
		jsPlace:"bottom", //编译后js文件位置,位于header或者页面底部
	
		baseDir:'app', //静态文件名称
		cssDir : 'app/css', //css文件夹名称
		imagesDir : 'app/css/i', //images文件夹名称
		jsDir: 'app/js', //js文件夹名称
		htmlDir: 'html', //html文件夹名称
		widgetDir: 'widget', //widget文件夹名称
	
		buildDirName:'html', //编译的文件夹名称
		outputDirName:'build', //输出文件夹名称
		outputCustom:'a/,b/', //自定义输出文件夹
	
		projectPath: 'product/index/', //工程目录前缀
		host:"192.168.1.1", //远端机器IP
		serverDir: 'cdndir', //上传至远端服务器文件夹名称
		localServerPort: 3000 //本地服务器端口

## 相关命令
	 
	 Usage: jdf <Command>:

	 Command:

	   install             install init dir, demo
	   build               build project
	         -open         auto open html/index.html

	   release             release project

	   output              output project
	         -html         output project (include html)
	         dirname       output your own custom dirname
	         -debug        uncompressed js,css,images for test
	         -backup       backup outputdir to tags dir

	   upload              upload output files to remote sever
	         -html         upload output project (include html)
	         dirname       upload output your own custom dirname
	         -debug        uncompressed js,css,images for test
	         -custom       upload a dir/file to server

	   widget
	         -preview      preview a widget
	         -install      install a widget
	         -publish      publish a widget

	 Extra commands:

	   compress            compress js/css (jdf compress input output)
	   clean               clean cache folder
	   -h                  get help information
	   -v                  get the version number



