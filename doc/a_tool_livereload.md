# LiveReload自动刷新浏览器

## 使用说明

* 1.现在仅支持chrome浏览器下的自动刷新，所以首先我们要安装 [LiveReload chrome 插件](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
* 2.然后打开当前工程目录，CMD下执行 jdf build -open
* 3.点击LiveReload chrome 插件，使当前页面 "Enable LiveReload"
* 4.jdf如果提示"Browser connected LiveReload"，则说明浏览器和LiveReload连接成功
* 5.最后在编辑器里修改工程文件保存后，页面即会自动刷新

## 特别说明

如果有两个进程那么第二个进程的livereload功能被关闭

## 参考资料

* [LiveReload官网](http://livereload.com/)
* [LiveReload protocol](http://feedback.livereload.com/knowledgebase/articles/86174-livereload-protocol)
