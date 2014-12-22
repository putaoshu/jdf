#工作流程对比

## 传统工作流程
* 页面制作
* 创建页面
* 文件编译
* 移除调试代码
* 静态资源合并
* 手动部署至测试环境机器
* 内网测试

## 工具化流程
* 自动生成标准化项目工程文件目录

		jdf install init

* 开发时文件有就变动自动编译

		jdf build

* 静态资源文件自动合并

		??a.js,b.js //js文件配合cnd服务器combo服务自动合并
		widget.css //所有widget模块中引用的css文件自动合并可配置输出
		widget.js //所有widget模块中引用的js文件自动合并可配置输出

* 一键上传至测试环境

		jdf upload