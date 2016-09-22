# 利用jdf调试移动设备的页面

一直以来，在移动设备上都缺少类似Firebug、Chrome dev的开发工具，导致在这些移动设备上调试页面是一件非常头疼的事情。
今天利用jdf，你可以通过三步轻松的搞定这件事情。

#### 一、需要在本地进行一些简单的设置
1、在当前项目的`config.json`中打开调试开关<b style="color: red;">（切记：在调试完页面之后，一定要关闭此开关，然后重新输出项目）</b>
```javascript
"build":{
    "weinre": true //true为打开，false为关闭
}
```
2、打开fiddler，确认其设置的端口号，一般默认为8888
3、手机连接电脑热点wifi，将手机的wifi设置中的`HTTP代理`设置为手动。
其中的“服务器”设置为连接的电脑ip地址，端口号要与fiddler一致。如下图所示：
<img style="margin: 10px; box-shadow: 0 0 10px rgba(0,0,0,.2)" src="http://img30.360buyimg.com/uba/jfs/t2755/132/3822634990/56043/a37f6a33/579b1fddNe3759a60.png" height=500 alt="">

#### 二、上传项目到测试服务器

```javascript
jdf upload -nc
jdf upload -nh
```

分别执行以上两条命令，上传html、css、js、图片等文件到测试服务器，然后在电脑上打开项目的测试地址，例如：
```javascript
http://page.jd.com/test/html
```

你会看到当前项目的文件列表中多了一个`_debug.html`
```html
_debug.html                                        14-Aug-2015 02:20     390
index.html                                         14-Aug-2015 02:20    5831
test.html                                          14-Aug-2015 02:20     688
```
点击它，会看到项目中所有的html页面链接，点击你要调试的页面，就会打开一个类似于`Chrome dev`的调试工具。


#### 三、在移动设备上打开测试服务器上需要调试的页面，例如：
```html
http://page.jd.com/test/index.html
```

#### 四、没有第四了，接下来你可以在pc上尽情的调试移动设备上的页面了。

注意：项目开发完毕以后，一定要将第一步中的开关置为关闭状态，然后再重新输出上线文件。



