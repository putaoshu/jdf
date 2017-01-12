# 快速入门

## 初始化项目
在命令行执行如下命令，生成标准化的项目文件夹
	
	jdf install init

jdf_init文件中里包括css、html、js、widget、config.json，其中config.json为配置文件，所有配置都需要修改此文件

注：config.json文件不允许有注释，单双引号使用时也需要统一

## 项目开发
* 在html，js，css等文件夹中新建相应文件
* 比如在html文件夹里新建一个页面index.html
* 在widget文件夹新建抽离规划好的widget模块，即通过`jdf w -c mywidget`命令新建一个widget，包含js/scss/vm/json
* index.html中任意位置插入`{%widget name="mywidget"%}`

## 项目调试
* 可以通过`jdf build -o` 在浏览器中查看构建后的当前工程
* mac下用80端口调试页面要先执行`sudo -s`之后再执行`jdf build -o`，因为mac访问访问1024以下端口需要root权限

## 项目输出
`jdf output`输出项目文件夹，包括压缩合并css，js，images，静态资源加cdn前缀，同时压缩所有png图片
`jdf output js/test.js，css` 自定义输出自己需要的文件或文件夹

## 项目联调和发布
`jdf upload` 发布css/js/widget/html至远端机器，可联调与查看