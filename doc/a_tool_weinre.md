# 利用jdf调试移动设备的页面

一直以来，在移动设备上都缺少类似Firebug、Chrome dev的开发工具，导致在这些移动设备上调试页面是一件非常头疼的事情。
今天利用jdf，你可以通过三步轻松的搞定这件事情。

#### 1、在当前项目的`config.json`中打开调试开关
```javascript
"build":{
    "weinre": true //true为打开，false为关闭
}
```

#### 2、上传项目到测试服务器

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


#### 3、在移动设备上打开测试服务器上需要调试的页面，例如：
```html
http://page.jd.com/test/index.html
```

#### 4、没有第四了，接下来你可以在pc上尽情的调试移动设备上的页面了。

注意：项目开发完毕以后，一定要将第一步中的开关置为关闭状态，然后再重新输出上线文件。



