# jdf doc

[![NPM version](https://badge.fury.io/js/jdf.png)](http://badge.fury.io/js/jdf)

[![NPM](https://nodei.co/npm/jdf.png?downloads=true)](https://nodei.co/npm/jdf/)

## 更新日志

* [changelog](https://github.com/putaoshu/jdf/blob/master/CHANGELOG.md)

## 关于jdf

*   jdf为前端开发集成解决方案:
*   目的是合理，快速和高效的解决前端开发中的工程和项目问题；
*   核心提供了前端开发必备的基础的UI和业务组件，并集成调试，构建，布署，代码生成，文档生成，编辑器插件等一系列开发工具；
*   同时提供了前端模块的安装，下载，发布，提交，预览．

## 功能介绍

* 跨平台:完美支持windows、mac、linux等系统
* 项目配置:支持为项目创建一个配置文件，按选项统一编译
* 错误提示:在编译过程中如果遇到语法的错误，在控制台可以输出错误信息，方便定位代码错误位置
* 支持volicity模板编译，可供前后端共享模板
* 支持本地，联调，线上三种开发流程
* 支持公共widget的引用，预览，安装和发布
* 可生成标准化的项目文件夹
* 支持给所有静态资源添加CDN域名前缀或后缀戳
* 支持css引用的所有链接生成combo格式
* 支持文件夹或者单独文件css和js文件压缩
* 支持less，sass实时监听文件，当文件改变时自动执行编译成css
* 支持cmd模块自动提取文件id和dependencies，压缩时保留require关键字
* 支持备份当前工程文件
* 内置png图片压缩插件，支持将png24压缩为png8
* 内置本地开发调试服务器，支持html和静态文件预览，以及当前目录浏览
* 支持文件监听，保存后文件即可在浏览器即时预览
* 支持上传到远端服务器，利用文件监听，即实现本地文件保存后可上传至远端服务器
* 编码统一化，即无论当前文件格式是gbk，gb2312，utf8，utf8-bom，统一输出utf8
* 多条命令，可满足不同的开发需求

## 安装使用

*   jdf基于nodejs
	*   [nodejs安装](http://nodejs.org/download/)
	*   node版本需要 >=0.8.0
*   安装jdf
	* npm install jdf **-g** --save-dev
*   安装测试
	* 执行 jdf -v 如果出现版本号则说明你已安装成功

## 示例演示

*   [示例安装](https://github.com/putaoshu/jdf-doc/blob/master/demo.md#%E7%A4%BA%E4%BE%8B%E5%AE%89%E8%A3%85)
*   [示例演示](https://github.com/putaoshu/jdf-doc/blob/master/demo.md#%E7%A4%BA%E4%BE%8B%E6%BC%94%E7%A4%BA)

## 开发流程

*   [新建工程目录](https://github.com/putaoshu/jdf-doc/blob/master/dev.md#%E6%96%B0%E5%BB%BA%E5%B7%A5%E7%A8%8B%E7%9B%AE%E5%BD%95)
*   [项目开发](https://github.com/putaoshu/jdf-doc/blob/master/dev.md#%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91)
*   [项目本地调试](https://github.com/putaoshu/jdf-doc/blob/master/dev.md#%E9%A1%B9%E7%9B%AE%E6%9C%AC%E5%9C%B0%E8%B0%83%E8%AF%95)
*   [项目输出](https://github.com/putaoshu/jdf-doc/blob/master/dev.md#%E9%A1%B9%E7%9B%AE%E8%BE%93%E5%87%BA)
*   [项目联调和发布](https://github.com/putaoshu/jdf-doc/blob/master/dev.md#%E9%A1%B9%E7%9B%AE%E8%81%94%E8%B0%83%E5%92%8C%E5%8F%91%E5%B8%83)
*   [项目备份](https://github.com/putaoshu/jdf-doc/blob/master/dev.md#%E9%A1%B9%E7%9B%AE%E5%A4%87%E4%BB%BD)
*   [工作流程对比](https://github.com/putaoshu/jdf-doc/blob/master/compare.md)

## 方案规范

*   [项目目录规范](https://github.com/putaoshu/jdf-doc/blob/master/dir.md#%E9%A1%B9%E7%9B%AE%E7%9B%AE%E5%BD%95%E8%A7%84%E8%8C%83)
    *   项目目录
    *   输出目录
    *   上线目录
*   [ui和unit组件目录规范](https://github.com/putaoshu/jdf-doc/blob/master/dir.md#ui%E5%92%8Cunit%E7%BB%84%E4%BB%B6%E7%9B%AE%E5%BD%95%E8%A7%84%E8%8C%83)
	*  ui和unit目录
*   [widget目录规范](https://github.com/putaoshu/jdf-doc/blob/master/dir.md#widget%E7%9B%AE%E5%BD%95%E8%A7%84%E8%8C%83)
	* widget目录
	* widget目录细化

## widget组件

*   [生态圈](https://github.com/putaoshu/jdf-doc/blob/master/widget.md#%E7%94%9F%E6%80%81%E5%9C%88)
*   [widget定义](https://github.com/putaoshu/jdf-doc/blob/master/widget.md#widget%E5%AE%9A%E4%B9%89)
*   [组成形式](https://github.com/putaoshu/jdf-doc/blob/master/widget.md#%E7%BB%84%E6%88%90%E5%BD%A2%E5%BC%8F)
*   [引用方法](https://github.com/putaoshu/jdf-doc/blob/master/widget.md#%E5%BC%95%E7%94%A8%E6%96%B9%E6%B3%95)
*   [开发目录](https://github.com/putaoshu/jdf-doc/blob/master/widget.md#%E5%BC%80%E5%8F%91%E7%9B%AE%E5%BD%95)
*   [页面输出](https://github.com/putaoshu/jdf-doc/blob/master/widget.md#%E9%A1%B5%E9%9D%A2%E8%BE%93%E5%87%BA)
*   [编译输出](https://github.com/putaoshu/jdf-doc/blob/master/widget.md#%E7%BC%96%E8%AF%91%E8%BE%93%E5%87%BA)
*   [相关命令](https://github.com/putaoshu/jdf-doc/blob/master/widget.md#%E7%9B%B8%E5%85%B3%E5%91%BD%E4%BB%A4)

## js组件

*   [组件类型](https://github.com/putaoshu/jdf-doc/blob/master/js.md#%E7%BB%84%E4%BB%B6%E7%B1%BB%E5%9E%8B)
*   [组件写法](https://github.com/putaoshu/jdf-doc/blob/master/js.md#%E7%BB%84%E4%BB%B6%E5%86%99%E6%B3%95)
*   [引用方法](https://github.com/putaoshu/jdf-doc/blob/master/js.md#%E5%BC%95%E7%94%A8%E6%96%B9%E6%B3%95)
*   [公共base引用](https://github.com/putaoshu/jdf-doc/blob/master/js.md#%E5%85%AC%E5%85%B1base%E5%BC%95%E7%94%A8)
*   [页面头尾初始化](https://github.com/putaoshu/jdf-doc/blob/master/js.md#%E9%A1%B5%E9%9D%A2%E5%A4%B4%E5%B0%BE%E5%88%9D%E5%A7%8B%E5%8C%96)
*   [本地调试](https://github.com/putaoshu/jdf-doc/blob/master/js.md#%E6%9C%AC%E5%9C%B0%E8%B0%83%E8%AF%95)
*   [最佳实践](https://github.com/putaoshu/jdf-doc/blob/master/js.md#%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5)
*   [依赖管理方案](https://github.com/putaoshu/jdf-doc/blob/master/depend.md)

##vm模板

* [设计原则](https://github.com/putaoshu/jdf-doc/blob/master/vm.md#设计原则)
* [velocity模板引挚](https://github.com/putaoshu/jdf-doc/blob/master/vm.md#velocity模板引挚)
* [目录结构](https://github.com/putaoshu/jdf-doc/blob/master/vm.md#目录结构)
* [引用方法](https://github.com/putaoshu/jdf-doc/blob/master/vm.md#引用方法)
* [velocity基本语法](https://github.com/putaoshu/jdf-doc/blob/master/vm.md#velocity基本语法)
* [velocity语法详解](https://github.com/putaoshu/jdf-doc/blob/master/vm.md#velocity语法详解)
* [数据源举例](https://github.com/putaoshu/jdf-doc/blob/master/vm.md#数据源举例)

##集成工具使用
*   [LiveReload](https://github.com/putaoshu/jdf-doc/blob/master/livereload.md)


## 配置API

*   [配置API](https://github.com/putaoshu/jdf-doc/blob/master/config.md)

## 命令手册

*   [命令手册](https://github.com/putaoshu/jdf-doc/blob/master/api.md)

## 编译器插件

* [Sublime Text2 插件](https://sublime.wbond.net/packages/Jdf%20-%20Tool)