# 示例

## 示例安装
安装一个完整的demo，只需要执行

	jdf install demo

## 示例目录
目录结构如下


	├──jdf_demo
	|	└──index   
	|		  └── branches 
	|		  	   └── jdf_demo_2014
	|		  	   		├── app //静态文件目录
	|		  	   		├── html //预览页面html
	|		  	   		├── widget //模块化目录
	|		  	   		└── config.json //配置文件
				  	   		
更具体的目录规范请参考 [目录规范](dir.md)

## 示例演示
命令行下进入jdf_demo_2014根目录，在命令行下执行

	jdf build

启动内置server或者

	jdf build -open 

启动内置server并自动打开默认浏览器进入 [http://localhost:3000/html/index.html](http://localhost:3000/html/index.html)

修改jdf_demo_2014中相关项目文件，后台会自动编译，刷新浏览器即可以调试

## 小提示
windows7下在当前文件夹打开命令行的方法:Shift+鼠标右键，选择"在此处打开命令窗口"
