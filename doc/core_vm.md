# vm模板

## 设计原则
让前端来写后端的vm模板，并且前端不需要搭建各种繁杂的后端环境，前后端以 .vm 为沟通桥梁，另外模板的数据源可以在项目开始前前后端约定之后生成JSON文件，从而使两个角色并行开发。

## velocity模板引挚
velocity模板语法的javascript实现，Velocity是基于Java的模板引擎，应用广泛。Velocity模板适用于大量模板使用的场景，支持模板嵌套，复杂的逻辑运算，包含基本数据类型、变量赋值和函数等功能。

## 目录结构
* html/vm.html
* widget/vm/vm.json
* widget/vm/vm.vm

## 引用方法

	{%widget name="vm" data='{"name":"myname"}'%}
	
注意data之间的单双引号，data内容必须为json类型

## 数据源分类
* data传参数据源，如 {%widget name="vm" data='{"name":"myname"}' %} 中的{"name":"myname"}
* 数据源文件，如widget/vm/vm.json的内容
* 两者优先级 "data传参数据源" > "数据源文件"，即data传参数据源和数据源文件，数据名称相同时，以"data传参数据源"为准

## velocity基本语法

* 1."#"用来标识Velocity的脚本语句，包括#set、#if 、#else、#end、#foreach、#end、#iinclude、#parse、#macro等，如:

		#if($info.images)
		<img src="$info.images">
		#else
		<img src="noPhoto.jpg">
		#end

* 2."$"用来标识一个变量，如

		$i、$msg.errorNum

* 3."!"用来强制把不存在的变量显示为空白

		$!msg

* 4.注释，如：

		## 这是一行注释，不会输出

## velocity语法详解

具体更详细的语法可参考[官网] (http://velocity.apache.org/engine/devel/user-guide.html)
如vm.vm


* 1.变量赋值输出
	
		Welcome $name to Javayou.com!
		today is $date.
		tdday is $mydae.//未被定义的变量将当成字符串

* 2.设置变量值,所有变量都以$开头

		#set( $iAmVariable = "good!" )
		Welcome $name to Javayou.com!
		today is $date.
		$iAmVariable

* 3.if,else判断

		#set ($admin = "admin")
		#set ($user = "user")
		#if ($admin == $user)
		Welcome admin!
		#else
		Welcome user!
		#end

* 4.迭代数据List ($velocityCount为列举序号，默认从1开始) 

		#foreach( $product in $allProducts )
			<li>$velocityCount $product.title</li>
		#end

* 5.迭代数据get key

		#foreach($key in $myProducts.keySet() )  
			$key `s value: $myProducts.get($key)
		#end

* 6.导入其它文件,可输入多个

		#parse("vm_a.vm")
		#parse("vm_b.vm")

* 7.[todo多个文件用逗号隔开]

* 8.简单遍历多个div
        #foreach( $i in [1,2,3,4] )
            <div>$i</div>
        #end



## 数据源举例

如vm.json

	{
		"name":"vm name",
		"allProducts":[
			{
				"title": "风", 
				"from": "中国" 
			}, 
			{
				"title": "应用", 
				"from": "河北"
			}
		],
		"myProducts":{
			"age":9,
			"from":"cn"
		}
	}
