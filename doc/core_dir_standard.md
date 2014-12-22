# 目录规范

## 名词解释

* ui 为ui效果组件
* unit 为涉及到实际业务并可以公用的组件
* widget 为可共用的实际项目中组件
* 项目目录 为当前要开发的项目目录
* 输出目录 为联调测试时用的目录
* 上线目录 为实际上线后的目录

## 项目目录规范

良好的目录结构更有利于组织代码,并方便团队成员间浏览代码

* 项目目录

		├─────jdf_demo
		|		  └──index   
		|		  	   	├── css //css文件夹
		|				|	└── i //图片文件夹
		|		  	   	├── js //js文件夹
		|		  	   	├── html //预览页面html
		|		  	   	├── html/images //预览页面的素材图片文件夹
		|		  	   	├── doc //项目文档,项目介绍
		|		  	   	├── widget //组件目录，包括模板组件，js组件，css组件
		|				|	└── header
		|				|		├── header.vm //模板文件
		|				|		├── header.json //vm的数据源文件		
		|				|		├── header.css //css文件
		|				|		├── header.js //js文件
		|				|		├── i/ //等待上线的图片文件夹
		|				|		├── images/ //素材图片文件夹
		|				|		└── header.js //js文件
		|		  	   	└── config.json //配置文件

* 项目跨年文件目录

		├─────user
		|		├──myjd
		|		├──club_2015
		|		├──club_2016
		|		├──club
		|		|  	 ├── css //css文件夹
		|		|	 |	   └── i //图片文件夹
		|		| 	 ├── js //js文件夹
		|		|  	 ├── html //预览页面html
		|		|  	 ├── html/images //预览页面的素材图片文件夹
		|		|  	 ├── doc //项目文档,项目介绍
		|		|  	 ├── widget //组件目录，包括模板组件，js组件，css组件
		|		|	 |		├─────header
		|		|	 |		|		├── header.vm //模板文件
		|		|	 |		|		├── header.json //vm的数据源文件		
		|		|	 |		|		├── header.css //css文件
		|		|	 |		|		├── header.js //js文件
		|		|	 |		|		├── i/ //等待上线的图片文件夹
		|		|	 |		|		├── images/ //素材图片文件夹
		|		|	 |		|		└── header.js //js文件
		|		|	 |		|		
		|		|	 |		└──────header_2014
		|		|	 |				├── header.vm //模板文件
		|		|	 |				└── header.js //js文件		
		|		|	 |				
		|		|  	 └── config.json //配置文件   
		|		| 
		|		├──myjd
		|		└──vip

* 项目目录v1(已弃用)

		jdf_demo/index/app/

* 输出目录

		├──jdf_demo
		|	└──index   
		|		├── css //css文件目录
		|		├── html //预览页面html，仅供测试用
		|		└── js //js文件目录

* 上线目录

		├──jdf_demo
		|	└──index   
		|		├── css //css文件目录
		|		├── css/i //图片文件目录
		|		└── js  //js文件目录

* 目录说明

	* jdf_demo/index/ 为当前项目的svn根目录
	* jdf_demo/css 为静态文件css目录
	* jdf_demo/css/i 为静态文件图片目录
	* jdf_demo/js 为静态文件js目录
	* jdf_demo/html 为预览页面html目录，仅做为测试联调看效果
	* jdf_demo/config.json 为当前项目配置文件，所有打包,合并,输出,上传服务器均可以此文件中配置

* 注意事项
	* config.json中配置了 "projectPath" 即工程目录前缀，那么会直接取 "projectPath" 的值做为静态资源文件前缀

##  ui和unit组件目录规范
* ui和unit目录

		├──	jdf
		|	└──1.0.0
		|		├── build //编译输出文件目录
		|		├── html //预览页面html
		|		├── ui //ui组件化目录
		|		|	├── dialog //dialog组件
		|		|	|	└── 1.0.0
		|		|	|		├── example 组件示例文件夹
		|		|	|		|    ├──dialog.html 组件示例
		|       |   |       |    └──dialog_fixed.html
		|       |   |       |    
		|		|	|		├── dialog.css
		|		|	|		├── dialog.png
		|		|	|		└── dialog.js
		|		|	|		
		|		|	└── switchable //switchable组件
		|		|		└── 1.0.0
		|		|			├── switchable.css
		|		|			└── switchable.js
		|		├── unit //ui组件化目录
		|		|	├── login //登陆注册组件
		|		|	|	└── 1.0.0
		|		|	|		└── login.js
		|		|	└── search //搜索组件
		|		|		└── 1.0.0
		|		|			└── search.js		
		|		└── config.json //配置文件

* 目录说明

	* jdf/1.0.0  为ui和unit组件根目录,其中1.0.0为当前组件大版本号
	* ui 为ui组件目录
	* ui/dialog/1.0.0 为一个ui组件的目录,其中1.0.0为当前组件的版本号,修正bug类递增0.0.1,大版本递增1.0.0
	* unit 为unit组件目录
	* config.json 为当前项目配置文件

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
		|		  └──index   
		|		  	   	├── css //css文件夹
		|				|	└── i //图片文件夹
		|		  	   	├── widget //组件目录，包括模板组件，js组件，css组件
		|				|	└── header
		|				|		├── header.css //css文件
		|				|		├── i/ //等待上线的图片文件夹
		|				|		├── images/ //素材图片文件夹
		|				|		└── header.js //图片文件


* 说明
	* widget中: 要上线的的图片放在当前widget的i文件夹下, 素材图片放在images文件夹下
	* /css/中: 图片放在当css/的i文件夹下
	* 上线时widget中的图片会全部复制至/css/i下
