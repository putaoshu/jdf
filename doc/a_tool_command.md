# 命令手册

## jdf install
* `jdf install init xxx`，在本地初始化一个jdf的标准项目，目录结构如下所示。`xxx`可省略，省略后默认的项目名称为`jdf_init`。

<pre>
jdf_init
├── config.json      //jdf配置文件
├── css              
│    └── i           //css中的背景图片
├── html             //html文件夹
│    └── index.html  //项目的默认首页
├── js
├── widget           //页面中用到的所有widget
</pre>

jdf的详细配置文档，可点击[这里](a_tool_config.md)进行查阅。

* `jdf install demo`，下载安装一个[jdf示例](a_tool_example.md)

## jdf build
执行此命令jdf会开启一个[本地服务](a_tool_server.md)用来构建项目，默认端口为`80`。

* `-open`，在开启本地服务的同时，自动打开`html/index.html`
* `-css xxx`，把less/sass编译为css
* `-plain`，编译项目引用的widget，sass文件，并不对文件进行任何形式的压缩和替换

## jdf output

输出当前项目到`build`文件夹，所谓的“输出”，指的是jdf会自动做以下几件事情：

* 替换文件中的[widget](core_widget.md)引用标签为实际内容
* 把less/sass文件编译为css
* 合并压缩css、js、png文件，使用[cssSprite](a_tool_csssprite.md)技术将小图片合并为一张大图
* 给css文件中引用的背景图片添加cdn

---

* `-html`，只输出html文件到build目录中
* dirname，输出到自定义的文件夹中
* `-debug`，输出未压缩的css、js、图片文件

## jdf upload

把当前项目上传到测试服务器。直接执行`jdf upload`时，只上传js、css、图片文件到测试服务器。

* dirname，只上传指定的文件夹/文件到测试服务器
* `-debug`，上传时不压缩js、css、图片文件，以方便测试
* `-preview`，只上传html文件到测试服务器
* `-nc`，上传css/js/widget/至misc.360buyimg.com文件夹，其间把html中静态资源misc.360buyimg.com替换为page.jd.com:81
* `-nh`，上传html/至page.jd.com，其间把html中静态资源misc.360buyimg.com替换为page.jd.com:81

其中page.jd.com:81可以直接访问，而misc.360buyimg.com是线上cdn路径，访问测试机器需要配置hosts，即`jdf upload -nc`和`jdf upload -nh`两条命令解决了配置hosts的问题

## jdf widget

* `-create xxx`，创建一个widget
* `-all`，预览当前项目中的所有widget
* `-preview xxx`，预览指定的widget
* `-list`，获取服务器上所有的widget列表
* `-install xxx`，下载安装widget到本地项目中
* `-publish xxx`，发布widgt到服务器上

## jdf server

开启一个[本地服务](a_tool_server.md)用来调试代码，默认端口为`80`

## jdf lint

html、css、js文件代码质量检查工具，详细用法可点击[这里](a_tool_lint.md)

## jdf format

html、css、js文件格式化工具，详细用法可点击[这里](a_tool_format.md)

## jdf compress

html、css、js文件压缩工具，详细用法可点击[这里](a_tool_deploy.md)

## jdf clean

清理jdf缓存文件，遇到比较反常的现象时，可尝试执行一下此命令

## jdf -h

获取jdf的帮助信息

## jdf -v

获取jdf的当前版本号


