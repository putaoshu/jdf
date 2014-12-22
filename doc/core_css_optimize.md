# css优化策略

2014-8-7

##combo策略(建议使用)
jdf v1.4.3+ 版本支持
	
	{%widget name="a"%}
	{%widget name="b"%}

编译后

	<link type="text/css" rel="stylesheet" href="http://cdn/??widget/a/a.css,widget/b/b.css" />

##合并策略(旧的,不建议使用)

	{%widget name="a"%}
	{%widget name="b"%}

编译后
	
	<link type="text/css" rel="stylesheet" href="http://cdn/widget.css" />

配置方法

* 1)在html页面任意处,增加如下代码

		{%widgetOutputName="mywidget"%}

* 2)或在config.json里面增加统一配置

		"widgetOutputName" : "mywidget"

* 3) 优先级: 1)大于2) 

##策略对比
合并策略: 把所有widget的css文件合并成一个文件,虽然可以降低请求数,但后期上线某一个widget,涉及到N个所有页面合并的widget都要上线,有一定的风险;同时多人开发联调,合并上传至测试机器会有冲突覆盖的问题.

combo策略: 真正实现模块化,多人开发,测试,联调,上线只上线相关的widget,所以建议使用此策略

##配置开关

config.json文件中

	"output":{		
		"cssCombo": true, //css进行combo
		"combineWidgetCss":false,//合并所有引用的widget中的css
	}

默认为combo策略,如果要使用`合并策略`,请把`combineWidgetCss`修正为true
