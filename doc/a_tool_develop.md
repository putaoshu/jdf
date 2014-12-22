# 快速入门

## 安装使用

jdf命令行工具是jdf前端集成解决方案的工具集，基于node.js和npm，jdf前需要先安装[node.js](http://nodejs.org/download/)，然后通过npm命令安装jdf
	
	npm install jdf -g
安装测试，执行如下命令，如果出现版本号则说明你已安装成功

	jdf -v
更新jdf
		
	npm update jdf -g

## 新建项目目录
在本机svn目录，主干上新建项目，比如product下项目test，即svn目录为/product/test
注：product为大项目名，test为测试项目

## 初始化项目
从命令行下进入test文件夹，在命令行执行如下命令，生成标准化的项目文件夹
	
	jdf install init

test文件中里包括css、html、js、widget、config.json，其中config.json为配置文件，所有配置都需要修改此文件

注1：json文件不允许有注释，单双引号使用时也需要统一
注2：windows7下在当前文件夹打开命令行的方法：Shift+鼠标右键，选择"在此处打开命令窗口"
注3：windows下CMD路径常用操作如下
		
	C:\Documents and Settings\Administrator>d: //C盘进入D盘
	C:\Documents and Settings\Administrator>cd xxx //进行C盘xxx目录
	C:\Documents and Settings\Administrator\xxx>cd .. //返回上一层目录

## 项目开发
在html，js，css等文件夹中新建相应文件
在widget文件夹新建抽离规划好的widget模块
在当前项目中，新建widget的命令为`jdf widget -create xxx`

## 本地预览调试
可以通过`jdf build` 在浏览器中查看构建后的当前工程，包括less，sass编译，widget编译等
	
	jdf build

注意

* 本地服务器默认启用80端口，如果此端口被占用，工具会自动启动1080端口，也可以通过`config.json`中`localServerPort`指定新端口
* 命令执行后工具本地服务器会一直运行，可以使用`ctrl+c`命令退出本地server
* 如果发现本地服务器在浏览器输出的文件夹和本地项目不一致，可通过`jdf clean`，清除服务器后台缓存，强制同步一次

本地调试服务器启动成功后，可能通过`jdf build -open`命令自动打开浏览器，也可以复制`http://localhost/`在浏览上打开，同时后台内置了监听文件夹功能，如果在IDE里修改、新增、删除任何文件/文件夹，均会同步至后台，浏览器里访问总是最新的代码

在浏览器中查看release后的工程，包括所有widget中js，css合并后效果，可以执行命令如下

	jdf release


## 项目输出
`jdf output`输出项目文件夹，包括压缩合并后的css，js，images，静态资源加cdn前缀，同时压缩所有png图片
`jdf output js/test.js，css` 自定义输出自己需要的文件或文件夹

## 项目联调和发布
`jdf upload` 发布至远端145机器，主要包括css/js/widget，供产品，设计师查看效果，以及后端工程师联调
`jdf upload -preview` 输出html，并上传至http://page.jd.com下
	

## 项目备份
`jdf output -backup` 备份app目录至tags文件夹，供和已线上版本对比
