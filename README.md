# jdf

[![NPM version](https://badge.fury.io/js/jdf.png)](http://badge.fury.io/js/jdf)

## 关于

* jd fe develop tools --- 前端开发集成解决方案，合理，快速和高效的解决前端开发中的工程和项目问题

## 功能介绍

* 完美支持windows、mac、linux等系统
* 支持本地，联调，线上三种开发模式
* 生成标准化的项目文件夹，并可配置
* [todo]支持css中图片地址自动加md5版本戳
* 支持给所有静态资源添加CDN域名前缀或后缀戳
* 支持文件夹中和单独文件css和js文件压缩
* 支持less即时编译
* 支持sass即时编译
* 支持引入外部公共模块，提升生产力
* 支持通过配置文件传参
* [todo]内置css sprites
* 内置png图片压缩插件，支持将png24压缩为png8
* 内置本地开发调试服务器，支持html和其它静态文件预览
* 支持文件监听，保存后文件即可在浏览器即时预览
* 支持上传到远端服务器，利用文件监听，可以实现本地文件保存后即可上传至远端服务器
* 编码统一化，无论当前文件格式是gbk，gb2312，utf8，utf8-bom，统一输出utf8
* 多条命令支持，满足你不同的开发需求

## 快速入门

* 安装nodejs
	* 下载地址 [nodejs](http://nodejs.org/download/)
* 安装jdf
	* npm install  jdf **-g**
	* 一直保持最新，最好使用 npm install  jdf **-g** --save-dev

## 应用举例

* 新建工程目录
	* 在svn主干上新建分支，名称为testitem，比如svn根目录/product/index/branches/testitem
	* 或者直接在主干新建项目文件夹，比如svn根目录/product/index/trunk/
	* 或者在某个目录新建项目文件夹，配置projectPath值后，开始项目开发
* 初始化工程目录
	* 在命令行下进入工程目录，执行
	* jdf init
* 项目开发
	* 在html，app/js/，app/css/文件夹中新建相应文件
* 项目本地调试
	* jdf b 在浏览器中查看build后工程，即http://localhost:3000/
	* jdf r 在浏览器中查看release后的工程，包括widget中所有模块合并后的css，js效果
* 项目发布
	* jdf o 输出项目文件夹，包括压缩css，js，images，静态资源加cdn前缀
	* jdf o -d 输出项目文件夹，包括压缩css，js，images和html文件夹，供联调使用
	* jdf o app/js/test.js 自由输出自己需要的文件，如app/js/test.js
* 项目联调
	* jdf u 发布至远端机器，供产品，设计师查看效果,以及后端工程师联调

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

		<!-- header -->
		<link type="text/css" rel="stylesheet"  href="/widget/tes/tes.css" source="widget"/>
		<script type="text/javascript" src="/widget/tes/tes.js" source="widget"/></script>

		<!--body -->
		<div class="test">this is test</div>

* 编译输出
	* 所有widget模块中css文件合并为pkg.css
	* 所有widget模块中js文件合并为pkg.js
	* 所有widget模块中images文件输出对应至目录

## 配置文档
config.json配置文件可配置项如下：

	{
		"deployDirName" : "html",
		"cdn":"http://www.cdn.com", 
		"jsPlace":"bottom",

		"baseDir" : "app",
		"cssDir" : "app/css",
		"imagesDir" : "app/css/i",
		"jsDir" : "app/js",
		"htmlDir" : "html",
		"widgetDir" : "widget",
		"outputDirName:" : "build",

		"projectPath" : "product/index/",
		"host" : "192.168.1.1",
		"serverDir" : "cdndir"
	}

## 相关命令

	 Commands:

	   i,install           download init dir ,demo, external module
	   b,build             build project
	   r,release           release project
	   o,output            output project
	   o,output   -d       output project ( include html folder)
	   o,output   file     output your own definition file
	   u,upload            upload output files to remote sever
	   u,upload   -d       upload output project ( include html folder)
	   u,upload   file     upload output your own definition file
	   w,widget   -p file  preview local widget

	 Extra commands:

	   c,compress          compress js&&css (jdf c input output)
	   -h                  get help information
	   -v                  get the version number

	 Example:

	  jdf install demo

## NPM
[![NPM](https://nodei.co/npm/jdf.png?downloads=true&stars=true)](https://nodei.co/npm/jdf/)
