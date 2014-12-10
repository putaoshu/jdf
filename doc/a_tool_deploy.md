# less/sass编译/png压缩/js/css压缩

## less,sass编译工具
* jdf默认开启此功能
* 即当前工程中的less,scss后缀的文件会进行编译处理,处理后的css文件放在缓存文件夹中

## png图片压缩工具
* jdf默认开启此功能
* pngquant是一个命令行程序,提供C库将24/32-bit的PNG图像降色到 (8-bit) PNG图像。经过转换能显著缩小图片体积 (通常缩小幅度达70%) 并且能保留所有的alpha透明度。 转换生成的图片可以兼容所有浏览器, 并且在IE6中比24-bit的PNG图片有更好的表现。

## js压缩工具
* jdf默认开启此功能

## css压缩工具
* jdf默认开启此功能
* 压缩比非常高,如下源码

		.hot{padding: 10px;}
		.news{padding: 10px;}

* 经过处理后为

		.hot,.news{padding:10px}

