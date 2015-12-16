# jdf doc

[![NPM version](https://badge.fury.io/js/jdf.png)](http://badge.fury.io/js/jdf)

[![NPM](https://nodei.co/npm/jdf.png?downloads=true)](https://nodei.co/npm/jdf/)

## 更新日志

* [changelog](https://github.com/putaoshu/jdf/blob/master/CHANGELOG.md)

## 关于JDF

* JDF为京东前端开发集成解决方案
* 目的是合理，快速和高效的解决前端开发中的工程和项目问题
* 核心提供了前端开发必备的基础的UI和业务组件，并集成调试，构建，布署，代码生成，文档生成，编辑器插件等一系列开发工具
* 同时提供了前端模块的下载，预览，发布

## 功能介绍

* 跨平台:完美支持windows、mac、linux等系统
* 支持本地，联调，线上三种开发流程
* 可生成标准化的项目文件夹
* 项目配置:支持为项目创建一个配置文件，按选项统一编译
* 错误提示:在编译过程中如果遇到语法的错误，在控制台可以输出错误信息，方便定位代码错误位置
* 支持公共widget的引用，预览，安装和发布
* 支持widget编译，内置widget编译引挚
* 支持volicity模板编译，可供前后端共享模板
* 支持less，sass实时监听文件，当文件改变时自动执行编译成css
* 支持给所有静态资源添加CDN域名前缀或后缀戳
* 支持js/css所引用的链接生成combo格式或者压缩一个文件
* 支持文件夹或者单独文件css和js文件压缩
* 支持cmd模块自动提取文件id和dependencies，压缩时保留require关键字
* 支持png图片压缩插件，将png24压缩为png8
* 支持备份当前工程文件
* 支持本地静态文件预览，内置本地开发调试服务器，以及当前目录浏览
* 支持文件监听，保存后文件即可在浏览器即时预览
* 支持上传到远端服务器，利用文件监听，即实现本地文件保存后可上传至远端服务器
* 支持html/js/css文件格式化
* 支持html/js/css文件lint，代码质量检查
* 编码统一化，即无论当前文件格式是gbk，gb2312，utf8，utf8-bom，统一输出utf8
* 多条命令，可满足不同的开发需求

## 会议/视频/QQ群

* 	2014-10-25 D2前端技术论坛@杭州《京东前端工业化实践之路》 [PPT下载](http://vdisk.weibo.com/s/C30SUspJtf4sv) , 慕课[视频1](http://www.imooc.com/video/4679) [视频2](http://www.imooc.com/video/4680)
* 	JDF技术支持
	* QQ群号: 305542952
	* 咚咚群号: 815294

## 安装使用

*   jdf基于nodejs
	*   [nodejs安装](http://nodejs.org/download/)
	*   node版本要求 v0.10.0~v0.12.7
*   安装jdf
	* npm install jdf **-g**
*   安装测试
	* 执行 jdf -v 如果出现版本号则说明你已安装成功

## 集成工具
* [配置API](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_config.md)
* [命令手册](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_command.md)
* [less/sass编译/png压缩/js/css压缩](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_deploy.md)
* [LiveReload自动刷新浏览器](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_livereload.md)
* [html/js/css文件lint代码质量检查](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_lint.md)
* [html/js/css文件格式化](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_format.md)
* [csssprite图片合并](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_csssprite.md)

## 工具示例
* [示例安装](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_example.md#示例安装)
* [示例演示](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_example.md#示例演示)

## 开发流程
* [新建工程目录](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_develop.md#新建工程目录)
* [项目开发](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_develop.md#项目开发)
* [项目本地调试](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_develop.md#项目本地调试)
* [项目输出](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_develop.md#项目输出)
* [项目联调和发布](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_develop.md#项目联调和发布)
* [项目备份](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_develop.md#项目备份)
* [工作流程对比](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_compare.md)

## 方案规范
* [项目目录规范](https://github.com/putaoshu/jdf/blob/master/doc/core_dir_standard.md#项目目录规范)
	* 项目目录
	* 输出目录
	* 上线目录
* [ui和unit组件目录规范](https://github.com/putaoshu/jdf/blob/master/doc/core_dir_standard.md#ui和unit组件目录规范)
	* ui和unit目录
* [widget目录规范](https://github.com/putaoshu/jdf/blob/master/doc/core_dir_standard.md#widget目录规范)
	* widget目录
	* widget目录细化	

## widget组件
*  [生态圈](https://github.com/putaoshu/jdf/blob/master/doc/core_widget.md#生态圈)
*  [widget定义](https://github.com/putaoshu/jdf/blob/master/doc/core_widget.md#widget定义)
*  [组成形式](https://github.com/putaoshu/jdf/blob/master/doc/core_widget.md#组成形式)
*  [引用方法](https://github.com/putaoshu/jdf/blob/master/doc/core_widget.md#引用方法)
*  [开发目录](https://github.com/putaoshu/jdf/blob/master/doc/core_widget.md#开发目录)
*  [页面输出](https://github.com/putaoshu/jdf/blob/master/doc/core_widget.md#页面输出)
*  [编译输出](https://github.com/putaoshu/jdf/blob/master/doc/core_widget.md#编译输出)
*  [相关命令](https://github.com/putaoshu/jdf/blob/master/doc/core_widget.md#相关命令)

## js组件
* [组件类型](https://github.com/putaoshu/jdf/blob/master/doc/core_js.md#组件类型)
* [组件写法](https://github.com/putaoshu/jdf/blob/master/doc/core_js.md#组件写法)
* [引用方法](https://github.com/putaoshu/jdf/blob/master/doc/core_js.md#引用方法)
* [公共base引用](https://github.com/putaoshu/jdf/blob/master/doc/core_js.md#公共base引用)
* [页面头尾初始化](https://github.com/putaoshu/jdf/blob/master/doc/core_js.md#页面头尾初始化)
* [本地调试](https://github.com/putaoshu/jdf/blob/master/doc/core_js.md#本地调试)
* [最佳实践](https://github.com/putaoshu/jdf/blob/master/doc/core_js.md#最佳实践)
* [依赖管理方案](https://github.com/putaoshu/jdf/blob/master/doc/core_js_depend.md)

##css组件
* [css组件](https://github.com/putaoshu/jdf/blob/master/doc/core_css.md#css组件)
* [ css优化策略](https://github.com/putaoshu/jdf/blob/master/doc/core_css_optimize.md# css优化策略)

##vm模板
* [设计原则](https://github.com/putaoshu/jdf/blob/master/doc/core_vm.md#设计原则)
* [velocity模板引挚](https://github.com/putaoshu/jdf/blob/master/doc/core_vm.md#velocity模板引挚)
* [目录结构](https://github.com/putaoshu/jdf/blob/master/doc/core_vm.md#目录结构)
* [引用方法](https://github.com/putaoshu/jdf/blob/master/doc/core_vm.md#引用方法)
* [velocity基本语法](https://github.com/putaoshu/jdf/blob/master/doc/core_vm.md#velocity基本语法)
* [velocity语法详解](https://github.com/putaoshu/jdf/blob/master/doc/core_vm.md#velocity语法详解)
* [数据源举例](https://github.com/putaoshu/jdf/blob/master/doc/core_vm.md#数据源举例)

## 编译器插件
* [Sublime Text2 插件](https://sublime.wbond.net/packages/Jdf%20-%20Tool)
