# widget模块

## widget定义
* widget模块是可复用并且能独立提供功能的页面片段，可以在单个项目里面使用，也可以发布贡献出来供其它项目使用

## 引用和配置方法
* 在页面中统一引入

		{%widget name="test"%}

此时当前widget文件夹下的vm编译到页面上,js和css也加载至页面上,同时json数据会打到vm里

* 在页面中统一引入时，带相关数据

		{%widget name="test" data='{"name":"my"}'%}

此时在test.vm里就可以通过引用`$name`来取name的值了

* 引入外部链接数据

		{%widget name="test" data='http://xxx.com/xxx.json'%}

* 在页面中单独引入widget的vm文件

		{%widget name="test" type="vm"%}

* 在页面中单独引入widget的vm文件

		{%widget name="test" type="vm"%}

* 在页面中单独引入widget的js文件

		{%widget name="test" type="js"%}

* 在页面中单独引入widget的css文件

		{%widget name="test" type="css"%}		

* widget引入时注释配置
	* 在页面中引入，不带文件路径注释

			{%widget name="test" comment="false"%}

	* 或在config.json里面配置统一的配置项 

			build: {
				widgetIncludeComment:true //默认为true，不带可以设置成false
			}
	
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

