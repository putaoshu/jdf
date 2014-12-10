# widget模块

## widget起源和定义

* 页面制作之前，如果有看起来十分相似的HTML、CSS片断，而你又想复用，一般我们会怎么做呢？
从现有大量的项目中或者线上，查找看有没有相同的代码，如果有的话手动复制出来部分HTML片断，从相应CSS文件中复制出对应的CSS代码，脚本也直接下载下来。
* 这样的处理方式对于小型网站问题不是太大，但对应海量用户的企业网站简直是恶梦，为了加快上线时间，这样处理，是顺利上线了，对后续维护的小伙伴造成极大困扰，修改或者新增一个简单的小需求，基本得把所有相关代码梳理一遍，并小心翼翼的上线，还怕出现问题，劳心费时。同时如果再有类似需求，可能会再一遍老路：网上找代码，快速上线，苦苦的维护。
那这个问题有没有对更好的解决方式呢？
* 这个时候我们会发现，能不能把HTML模版、Javascript脚本、CSS样式放在同一个文件夹中，这样引用比较方便，即直接引用这个文件夹脚本、样式引用至页面，模板直接引用；同时复用的问题也迎韧而解了，即如有类似交互需求，把三者同时加载到页面上来，有异同，在此文件夹基础上稍加修改就可以直接使用了。
* 另外如果我们每做一个项目，积累一两个这样的文件夹，大半年项目积累下来，垂直类网站如电商/招聘/安全等，最基本交互效果基本可以积累完成，新项目可快速制作，当然公司允许，能有专业前端同学花一整段时间来完成这件积累的事情那是最好的了。

* <del>widget定义：widget模块是可复用并且能独立提供功能的页面片段，可以在单个项目里面使用，也可以发布贡献出来供其它项目使用</del>

* 总结下：可复用的模版，脚本，样式三者的集合我们可称之为一个模块，模块也就是业界所说的组件仓库，类似bower。

* 有了可复用的模块我们可以做很多事情，比如构建一个模块系统，有新项目来时可以从模块系统查找一下看是否有类似模块，有的话直接拉到本地项目中直接使用；一个项目结束，做项目总结的时候可以把一些其它项目也可复用的模块提交至模块系统后台，后台审核后再发布至模块系统，这样一个模块生态圈就形成了。

## 生态圈

* 核心: 如果每人每天贡献出一个模块，如果每个项目贡献出一个模块，日积月累，那么开发时，只需要引入对应模块并在此基础上稍微修正，就可以以非常快的速度开发出一个复杂布局，多栏，多屏的页面.

* 生态循环
	* 依赖: jdf
	* 单一提交流程
		* 可复用widget提交 ==> 审核 ==> 接入公共库 

	* 引用提交循环流程
		* 开发项目 ==> 查看公共库是否有可用widget ==> 引用(仅一行代码) ==> 编入自己的工程 ==> 复用 ==>修正为新的widget ==> 可复用widget提交 ==> 审核 ==> 接入公共库

## 组成形式
* 可复用的vm片断
* 可复用的js片断
* 可复用的css片断

## 引用和配置方法
* 在页面中统一引入

		{%widget name="test"%}

此时当前widget文件夹下的vm编译到页面上,js和css也加载至页面上


* 在页面中单独引入widget的vm文件

		{%widget name="test" type="vm"%}

* 在页面中单独引入widget的vm文件

		{%widget name="test" type="vm"%}

* 在页面中单独引入widget的js文件

		{%widget name="test" type="js"%}

* 在页面中单独引入widget的css文件

		{%widget name="test" type="css"%}		

* <del>widget输出文件名配置</del>
	* <del>在引入页面增加widgetOutputName</del>
	
			{%widgetOutputName="mywidget"%}

	* <del>或在config.json里面配置统一的配置项</del>

			 widgetOutputName: widgetoutput

	已不建设使用此种合并策略,优先选用combo策略,jdf v1.4.3+ 版本支持,请参考css优化策略文档

* widget引入时注释配置
	* 在页面中引入，不带文件路径注释

			{%widget name="test" comment="false"%}

	* 或在config.json里面配置统一的配置项 

			build: {
				widgetIncludeComment:true //默认为true，不带可以设置成false
			}


## 开发目录

	widget //组件目录，包括模板组件，js组件，css组件
	  └── test
			├── example //举例
			├── test.vm //vm模板
			├── test.md //文档
			├── test.css //css文件
			├── i/ //等待上线的图片文件夹
			├── images/ //素材图片文件夹
			└── test.js //js文件
	
## 页面编译输出

执行`jdf build`

	<!-- js，css -->
	<link type="text/css" rel="stylesheet"  href="/widget/test/test.css" source="widget"/>
	<script type="text/javascript" src="/widget/test/test.js" source="widget"/></script>

	<!-- vm -->
	<div class="test">this is test</div>

## 页面交付输出

执行`jdf output`

* 所有widget模块中css文件combo如下

		<link type="text/css" rel="stylesheet" href="http://cdn/??widget/test/test.css,widget/b/b.css"  source="widget"/>

* 所有widget模块中js文件combo如下

		<script type="text/javascript" src="http://cdn/??widget/test/test.js,widget/b/b.js" source="widget"/></script>

## 相关命令

* `widget -all`  	preview all widget //预览所有项目中所有widget
* `widget -preview xxx`	preview a widget //预览一个widget模块
* `widget -install xxx` 	install a widget to local //安装一个widget模块到当前工程
* `widget -publish xxx` 	publish a widget to server //发布一个widget模块到服务端
* `widget -create xxx` 	create a widget to local //在本地项目新建一个widget,会生成widget文件夹和vm,css,js,json文件
* `widget -list` 	get widget list from server //取得服务端所有widget列表

