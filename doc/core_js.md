# js组件

## 组件类型
* ui和unit组件
* widget中js组件
* 非标准化组件

## 组件写法
* 源码

		define(function(require, exports, module){
			var a = require('widget/a/a.js');
			var b = require('widget/b/b.js');

			function init(){
				//todo
			}
			exports.init = init;
			//or return init;
		})

* 工具编译后

		define(['js/test.js'], ['/widget/a/a.js', 'widget/b/b.js' ], function(require, exports, module){
			require("widget/a/a.js"),require("widget/b/b.js");
			function init(){}
			exports.init = init;
		})

	* 其中 'js/test.js' 为当前文件的id,  ['widget/a/a.js', 'widget/b/b.js', ] 为当前js依赖的文件数组

## 引用方法

* ui和unit组件引用方法

		seajs.use(['jdf/1.0.0/unit/event/1.0.0/event.js'],function(event){ 
			//todo
		})

* 项目内js引用方法
	* 源码

		seajs.use(['/js/a.js','/js/b.js'],function(a,b){ 
			//todo
		})
	
	* 工具编译后 (projectPaht为项目路径名)

		seajs.use(['projectPaht/js/a.js','projectPaht/js/b.js'],function(a,b){ 
			//todo
		})
		
* 组件内require引用
	
		define(function(require, exports){
			var login = require('login.js');

			function init(){
				//todo
			}
			exports.init = init;
		})

	* 加载器会保证require加载完成后才执行init


## 公共base引用

	<link rel="stylesheet" type="text/css" href="http://misc.360buyimg.com/lib/skin/2013/base.css" media="all" />
	<script type="text/javascript" src="http://misc.360buyimg.com/jdf/lib/jquery-1.6.4.js"></script>
	<script type="text/javascript" src="http://misc.360buyimg.com/jdf/1.0.0/unit/base/1.0.0/base.js"></script>


## 页面头尾初始化
* 标准头尾
		
		seajs.use('jdf/1.0.0/unit/globalInit/1.0.0/globalInit',function(globalInit){
			globalInit();
		});

* 非标准头尾

	* 需要单独配置

## 本地调试
* 在页面后面增加?isdebug那么页面中所有js文件就不会combo合并,即

		http://localhost:3000/html/index.html?isdebug

* 使用jdf工具,则可以不压缩静态文件直接上传至测试服务器,中间仅增加了路径引用

		jdf upload -debug 


## 最佳实践
项目核心js顶部首先配置alias,如下

	seajs.config({
		alias:{
			'globalInit':'jdf/1.0.0/unit/globalInit/1.0.0/globalInit',
			'event':'jdf/1.0.0/unit/event/1.0.0/event.js'
		}
	})

项目页面引用时直接用alias来代替

	seajs.use('jdf/1.0.0/unit/globalInit/1.0.0/globalInit',function(globalInit){
		globalInit();
	});
	seajs.use('event',function(event){})

这样做的目的:

* 方便对所用到了的组件统一管理
* 后续升级只要修改一处即可

# js依赖管理方案

seajs的config中base所有项目统一设置假设为 http://cdn.com/

示例 (假设工程名为jdf_dependent)

* widget js文件使用require
		
		本地 require('/widget/test/test.js') ==> 工具编译后 require('jdf_dependent/widget/test/test.js')
		实现请求url为 http://cdn.com/jdf_dependent/widget/test/test.js

* widget js文件使用use
		
		本地 seajs.use('/widget/test/test.js') ==> 工具编译后 seajs.use('jdf_dependent/widget/test/test.js')
		实现请求url为 http://cdn.com/jdf_dependent/widget/test/test.js

* widget js中使用ui, unit组件调用方式如下 (注意不要加/, 因为这个是基于base, 所以编译不做处理)
		
		seajs.use('product/index/js/base/ui/accordion/accordion') ==> 工具编译后 seajs.use('product/index/js/base/ui/accordion/accordion')
		require('product/index/js/base/ui/accordion/accordion') ==> 工具编译后 require('product/index/js/base/ui/accordion/accordion')
		实现请求url为 http://cdn.com/product/index/js/base/ui/accordion/accordion.js

* js中使用调用方式如下 (注意不要加/, 因为这个是基于base)
		
		seajs.use('/js/test.js') ==> 工具编译后 seajs.use('jdf_dependent/js/test.js')
		require('/js/test.js') ==> 工具编译后 require('jdf_dependent/js/test.js')
		实现请求url为 http://cdn.com/jdf_dependent/js/test.js

