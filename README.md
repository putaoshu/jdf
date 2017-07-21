# jdf

[![NPM version](https://badge.fury.io/js/jdf.png)](http://badge.fury.io/js/jdf) [![Build Status](https://api.travis-ci.org/putaoshu/jdf.svg?branch=master)](https://travis-ci.org/putaoshu/jdf)

[![NPM](https://nodei.co/npm/jdf.png?downloads=true)](https://nodei.co/npm/jdf/)

## 关于JDF

* JDF京东前端开发集成解决方案（Jingdong front-end integrated solution）
* 目的是合理、快速和高效的解决前端开发中的工程和项目问题，主要提供了：
* 前端命令行工具：集调试、构建、布署为一体
* 前端模块：下载、预览、发布
* 前端开发流程：项目构建、编译、输出、联调、上线
* 前端组件：UI组件和业务组件（内网开源）
* 前端文档：编码规范、开发规范、组件和工具文档
* 前端周边扩展：代码文档和示例自动生成工具、代码编辑器插件、可视化工具等

## 更新日志

* [changelog](https://github.com/putaoshu/jdf/blob/master/CHANGELOG.md)

## 安装、使用与快速入门

*   jdf依赖nodejs和python
	* [nodejs安装](http://nodejs.org/download/) node版本要求v4.2.6及以上和[v6.9.4](https://nodejs.org/dist/v6.9.4/)以下
	* [python安装](https://www.python.org/downloads/) python版本无要求
*   安装jdf
	* npm install jdf **-g**
*   安装测试
	* 执行 jdf -v 如果出现版本号则说明你已安装成功
*   请仔细阅读快速入门文档，就可以开始项目开发了
	* [快速入门](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_develop.md)
*   更进一步，请阅读核心文档
	* [目录规范](https://github.com/putaoshu/jdf/blob/master/doc/core_dir_standard.md)
	* [配置文件文档](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_config.md)
	* [命令手册](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_command.md)

## 帮助文档
* [widget组件](https://github.com/putaoshu/jdf/blob/master/doc/core_widget.md)
* [js组件](https://github.com/putaoshu/jdf/blob/master/doc/core_js.md)
* [js前端模板](https://github.com/putaoshu/jdf/blob/master/doc/core_tpl.md)
* [css组件](https://github.com/putaoshu/jdf/blob/master/doc/core_css.md)
* [vm模板使用文档](https://github.com/putaoshu/jdf/blob/master/doc/core_vm.md)
* [smarty模版使用文档](https://github.com/putaoshu/jdf/blob/master/doc/core_smarty.md)
* [文件格式化](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_format.md)
* [本地server](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_server.md)
* [文件lint代码质量检查](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_lint.md)
* [liveReload自动刷新浏览器](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_livereload.md)
* [csssprite图片合并](https://github.com/putaoshu/jdf/blob/master/doc/a_tool_csssprite.md)

## 核心功能

#### 跨平台
* 完美支持windows、mac、linux三大系统

#### 项目构建
* 生成标准化的项目文件夹
* 支持本地，联调，线上三种开发流程
* 每个项目都拥有一个单独的配置文件，按选项统一编译

#### 模块开发
* 可快速方便的对模块进行创建，引用，预览，安装和发布
* 通过积累，可形成完全符合自己业务的模块云服务

#### 模块编译
* 支持模块编译，内置模块编译引挚
* 支持将vm和smarty模版编译为html
* 支持将sass和less编译为css
* 支持ES6

#### 项目优化
* 自动将页面中的js、css引用转换成combo请求格式
* 自动压缩优化js、css、png文件

#### 项目输出
* 默认给所有静态资源添加CDN域名前缀或后缀戳
* 支持cmd规范，自动提取文件id和dependencies，压缩时保留require关键字
* 支持png图片压缩插件，将png24压缩为png8
* 自动生成css雪碧图，并更新background-position属性值
* 可将小图片一键生成base64编码
* 支持图片生成webp格式，并更新相关css图片链接
* 文件编码统一化，即无论当前文件格式是gbk，gb2312，utf8，utf8-bom，统一输出utf8

#### 项目联调
* 一键上传文件到测试服务器，方便开发预览

#### 本地服务
* 支持开启本地服务器，方便调试
* 支持本地静态文件预览，内置本地开发调试服务器，以及当前目录浏览
* 支持实时监听文件，文件被修改时会自动编译成css，并刷新浏览器
* 实时在控制台输出错误信息，方便定位代码错误

#### 辅助工具
* 支持html/js/css文件格式化
* 支持html/js/css代码压缩
* 支持html/js/css文件lint，代码质量检查
* 支持chrome浏览器的LiveReload插件

#### 周边扩展
* [JDF demo下载](https://o8tcolhwh.qnssl.com/jdf_demo.tar)
* [JDF windows可视化工具JDF_UI下载](https://o8tcolhwh.qnssl.com/JDF_UI.exe)
* [JDF Sublime Text2 插件安装](https://sublime.wbond.net/packages/Jdf%20-%20Tool)
* [JDF组件构建平台示例](https://o8tcolhwh.qnssl.com/JDF_build_platform.gif)
* [JDD文档快速生成工具](https://github.com/putaoshu/jdd)

#### QQ群
* JDF官方支持群 305542952

#### 捐助支持
* [![捐助支持](http://img12.360buyimg.com/uba/jfs/t7039/155/7364878/28421/e34519ee/5971c075N7e8bdbe3.png)](http://img12.360buyimg.com/uba/jfs/t7039/155/7364878/28421/e34519ee/5971c075N7e8bdbe3.png)

