# 命令手册

## jdf build (jdf b)
执行此命令jdf会开启一个[本地服务](a_tool_server.md)用来构建项目，默认端口为`3000`。

* `-open`或者`-o`，在开启本地服务的同时，自动打开`html/index.html`

## jdf output (jdf o)

* `dirname`，输出到自定义的文件夹中，比如`jdf o js`即只输出js文件夹
* `-debug`，输出未压缩的css、js、图片文件

输出当前项目到`build`文件夹，所谓的“输出”，指的是jdf会自动做以下几件事情：

* 替换文件中的[widget](core_widget.md)引用标签为实际内容
* 把less/sass文件编译为css
* 合并压缩css、js、png文件，使用[cssSprite](a_tool_csssprite.md)技术将小图片合并为一张大图
* 给css文件中引用的背景图片添加cdn

## jdf upload (jdf u)

把当前项目上传到测试服务器。直接执行`jdf upload`时，只上传js、css、图片文件到测试服务器。

* `dirname`，只上传指定的文件夹/文件到测试服务器
* `-debug`，上传时不压缩js、css、图片文件，以方便测试
* `-preview`，只上传html文件到测试服务器
* `-customw`，自定义上传`jdf u -c ./localDirxxx /serverDirxxx serverIp`即把本地的localDirxxx所有文件夹上传到serverIp的serverDirxxx文件夹中

## jdf widget (jdf w)

* `-create xxx`，创建一个widget
* `-all`，预览当前项目中的所有widget
* `-preview xxx`，预览指定的widget
* `-list`，获取服务器上所有的widget列表
* `-install xxx`，下载安装widget到本地项目中
* `-publish xxx`，发布widgt到服务器上

## jdf server (jdf s)

开启一个[本地服务](a_tool_server.md)用来调试代码，默认端口为`3000`

## jdf lint

html、css、js文件代码质量检查工具，详细用法可点击[这里](a_tool_lint.md)

## jdf format

html、css、js文件格式化工具，详细用法可点击[这里](a_tool_format.md)

## jdf compress

html、css、js文件压缩工具

## jdf clean

清理jdf缓存文件，遇到比较反常的现象时，可尝试执行一下此命令

## jdf -h

获取jdf的帮助信息

## jdf -v

获取jdf的当前版本号


