# 目录规范

## 名词解释

* widget 为可共用的实际项目中组件
* 项目目录 为当前要开发的项目目录
* 输出目录 为联调测试时用的目录
* 上线目录 为实际上线后的目录

## 项目目录规范

* 项目目录

		├─────jdf_init //项目根目录
		|		├── css //css文件夹
		|		|	└── i //图片文件夹
		|		├── js //js文件夹
		|		├── html //预览页面html
		|		├── html/images //预览页面的素材图片文件夹
		|		├── doc //项目文档,项目介绍
		|		├── widget //组件目录，包括模板组件，js组件，css组件
		|		|	└── header
		|		|		├── header.vm //模板文件
		|		|		├── header.json //vm的数据源文件		
		|		|		├── header.css //css文件
		|		|		├── header.js //js文件
		|		|		├── i/ //等待上线的图片文件夹
		|		|		├── images/ //素材图片文件夹
		|		|		└── header.js //js文件
		|		└── config.json //配置文件


* 输出目录

		├──jdf_demo //变更名称可修改config.json中的"projectPath"
		|	├── css //css文件目录
		|	├── html //预览页面html，仅供测试用
		|	└── js //js文件目录

* 上线目录

		├──jdf_demo
		|	├── css //css文件目录
		|	├── css/i //图片文件目录
		|	└── js  //js文件目录

## widget目录规范

* widget目录

		├── widget //模块化目录，包括模板组件，js组件，css组件
		|	└── header
		|		├── header.vm //模板文件
		|		├── header.source //vm的数据源文件		
		|		├── header.css //css文件
		|		├── header.js //js文件
		|		└── header.png //图片文件

* 目录说明
	* header.source为当前tpl数据源文件

* widget目录细化
	* 模板组件: 包括tpl模板,css,js
	* css组件: 仅提供必要的css支持,一般会和tpl一起使用
	* js组件: 仅提供必要的js支持, 一般也会和tpl一起使用

## 图片目录规范

* 如下

		├─────jdf_demo
		|		  	├── css //css文件夹
		|			|	└── i //图片文件夹
		|		  	├── widget //组件目录，包括模板组件，js组件，css组件
		|			|	└── header
		|			|		├── header.css //css文件
		|			|		├── i/ //等待上线的图片文件夹
		|			|		├── images/ //素材图片文件夹
		|			|		└── header.js //图片文件

* 说明
	* widget中: 要上线的的图片放在当前widget的i文件夹下, 素材图片放在images文件夹下
	* /css/中: 图片放在当css/的i文件夹下
	* 上线时widget中的图片会全部复制至/css/i下
