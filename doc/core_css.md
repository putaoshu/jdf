#css组件

<table>
<tr><td>版本</td> <td> 日期</td> <td> 说明 </td> </tr>
<tr><td>v1.2</td> <td> 2014-8-20</td> <td> css组件更新</td> </tr>
<tr><td>v1.1</td> <td> 2014-7-21</td> <td> 重新分层和定义</td> </tr>
<tr><td>v1.0</td> <td> 2014-7-18</td> <td> 初版</td> </tr>
</table>

##定义

<table>
	<tr> <td>分层</td> <td>结构层+表示层</td> <td>行为层</td> </tr>
	<tr> <td></td> <td>html+css</td> <td>js</td> </tr>
	<tr> <td>基础库</td> <td>reset/scss扩展/grid/</td> <td>jquery/seajs/公共base/</td> </tr>
	<tr> <td>组件</td> <td>元件/静态组件</td> <td>ui组件/业务组件</td> </tr>
	<tr> <td>模块</td> <td colspan="2" style="text-align:center;">html/css/js(基础库+组件)</td>  </tr>
</table>

* 相关解释
	* 结构层：由html标记语言负责创建
	* 表示层：由CSS负责创建，负责如何显示相关内容
	* 行为层：负责处理对事件做出反应；
	* css元件：对原有html标签的进一步扩展和补充，比如一个 `button` 和一个带有icon的 `button`
	* css静态组件：仅有基础样式的html片断，比如 `tab` 静态组件，它仅有基本的导航和主体部分html，以及最最基础的样式
	* js ui组件：可完成一个完整的ui层交互的组件，比如焦点图组件，分页组件，模拟滚动条等等
	* js业务组件：可实现一个完整的业务形为的组件，比如登录组件，商品搜索，商品关注等等
	* 模块：含有html、js、css，由js组件和css组件构成，可实现一个完整的交互操作或者业务实现

##设计原则

简单，实用，可复用 

##css组件

* 基础库
	* reset 
	* lib
		* scss基类 [https://github.com/marvin1023/sassCore/blob/master/core/_css3.scss](https://github.com/marvin1023/sassCore/blob/master/core/_css3.scss) 
		* transitionPropertyName
		* border-radius
		* box-shadow
		* translate、scale
		* animation
	* grid

* 元件/静态组件

	* table
	* form
	* button
	* box
	* page
	* tips
	* dropdown
	* tab
	* step
	* loading
	* crumb

##css组件编写规范

* 文件目录，依据原来js组件目录规范，以test组件示例如下

		|       |   ├── test //test组件
		|       |   |   └── 1.0.0
		|       |   |       ├── example 组件示例文件夹
		|       |   |       |    ├──test.html 组件示例
		|       |   |       |    └──test_other.html
		|       |   |       |   
		|       |   |       ├── i 组件图片文件夹
		|       |   |       ├── images 组件素材文件夹
		|       |   |       ├── test.md 组件文档
		|       |   |       └── test.css 样式文件

* 命名：以“-”为基准，比如 `.ui-list` 是文本列表

##css组件代码示例

以ui-list即文本列表来示例

html

	<ul class="ui-list">
	    <li><a href="#">鲜切花直送全年999元</a></li>
	    <li><a href="#">车品夏季清仓299减60</a></li>
	    <li><a href="#">进口牛奶低至5折</a></li>
	    <li><a href="#">美德乐吸乳器0元试用</a></li>
	</ul>

css

	.ui-list{list-style:disc inside;}

example

	<!DOCTYPE html>
	<html>
	<head>
	<meta charset="utf-8" />
	<title>ui-xxx</title>
	<link rel="stylesheet" type="text/css" href="../../../ui-base/1.0.0/ui-base.css">
	<link rel="stylesheet" type="text/css" href="../ui-list.css">
	</head>
	<body>

	<h2>xxx</h2>

	</body>
	</html>

注意:example中的title是所有example索引菜单上的文字,如果有多个example,使用"_"分开,比如

	ui_list.html
	ui_list_ext.html

##css组件扩展命名
以下A和B那一个更好一些?

A)基于当前样式名扩展

	<h2>图文列表</h2>
	<ul class="ui-list-images">

	<h2>图文列表-竖排</h2>
	<ul class="ui-list-images ui-list-images-vertical">

	<h2>图文列表-图片距左</h2>
	<ul class="ui-list-images ui-list-images-left">

B)加特有属性样式名,全局统一调用

	<h2>图文列表</h2>
	<ul class="ui-list-images">
	<ul class="ui-list-images vertical">
	<ul class="ui-list-images left">

C)用实际业务来定义
	
	<h2>图文列表-竖排</h2>
	<ul class="ui-list-images news-list">

	<h2>图文列表-图片距左</h2>
	<ul class="ui-list-images product-list">

最终我们选择C),命名有语义

