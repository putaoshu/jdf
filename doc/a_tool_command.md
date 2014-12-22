# 命令手册

	 Usage: jdf <Command>

	 Command:

	   install      install init dir, demo
	   build        build project
	     -open      auto open html/index.html
	     -combo     combo debug for online/RD debug
	     -css       compile less/scss file in current dir

	   release      release project

	   output       output project
	     -html      output project (include html)
	     dirname    output your own custom dirname
	     -debug     uncompressed js,css,images for test
	     -backup    backup outputdir to tags dir

	   upload       upload css/js dir to remote sever
	     dirname    upload output your own custom dirname
	     -debug     uncompressed js,css,images for test
	     -custom    upload a dir/file to server
	     -preview   upload html dir to preview server dir
	     -nc        upload css/js dir to preview server dir use newcdn url
	     -nh        upload html dir to preview server dir use newcdn url

	   widget
	     -all       preview all widget
	     -list      get widget list from server
	     -preview xxx  preview a widget
	     -install xxx  install a widget to local
	     -publish xxx  publish a widget to server
	     -create xxx   create a widget to local

	   server       debug for online/RD debug
	   lint         file lint
	   format       file formater

	 Extra commands:

	   compress     compress js/css (jdf compress input output)
	   clean        clean cache folder
	   -h           get help information
	   -v           get the version number


##普通上传预览

`jdf upload` 上传css/js/widget/至misc
`jdf upload -preview` 上传html/至page.jd.com

##上传预览无需配置hosts

`jdf upload -nc` 上传css/js/widget/至misc.360buyimg.com文件夹，其间把html中静态资源misc.360buyimg.com替换为page.jd.com:81
`jdf upload -nh` 上传html/至page.jd.com，其间把html中静态资源misc.360buyimg.com替换为page.jd.com:81

其中page.jd.com:81可以直接访问，而misc.360buyimg.com是线上cdn路径，访问测试机器需要配置hosts，即`jdf upload -nc`和`jdf upload -nh`两条命令解决了配置hosts的问题
