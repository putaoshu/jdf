# csssprite图片合并

## 使用说明
### 默认单位为px
* 非常简单，只需要在css文件中对要合并的图片路径增加?__sprite后缀即可，比如

		.csssprite .abtest_huafei s {
		    background:url(i/icon_01.png?__sprite) no-repeat;
		}
		.csssprite .abtest_lvxing s {
		    background:url(i/icon_03.png?__sprite) no-repeat 6px 0px;
		}
		.csssprite .abtest_caipiao s {
		    background:url(i/icon_05.png?__sprite) no-repeat 5px 0px;
		}

* 执行jdf output，后台会进行css sprite编译操作后

		.csssprite .abtest_huafei s {
		    background:url(i/sprite_csssprite.png?__sprite) no-repeat;
		    background-position:0 0
		}
		.csssprite .abtest_lvxing s {
		    background:url(i/sprite_csssprite.png?__sprite) no-repeat 6px 0;
		    background-position:6px -39px
		}
		.csssprite .abtest_caipiao s {
		    background:url(i/sprite_csssprite.png?__sprite) no-repeat 5px 0;
		    background-position:5px -78px
		}

* 其中icon_01.png，icon_03.png，icon_05.png小图片被合成为sprite_csssprite.png，其中csssprite为当前css文件的文件名，sprite_为前缀

### 当css单位为rem时
* 在background中写上px到rem的转换比例
```css
html{
    font-size: 20px;
}
.icon1, .icon2{
    width: 1.8rem;
    height: 1.8rem;
    margin: 10px;
    background: url(i/icon7.png?__sprite__rem20) no-repeat;
    border: 1px solid black;
}
.icon2{
    background: url(i/icon8.png?__sprite__rem20) no-repeat;
}
```
转换之后：
```css
html {
	font-size: 20px
}
.icon1, .icon2 {
	width: 1.8rem;
	height: 1.8rem;
	margin: 10px;
	background: url(http://misc.360buyimg.com/jdf/Test/widget/w2/i/w2.png?__sprite__rem20) no-repeat;
	background-position: 0 0;
	background-size: 1.8rem 4.6rem;
	border: 1px solid #000
}
.icon2 {
	background: url(http://misc.360buyimg.com/jdf/Test/widget/w2/i/w2.png?__sprite__rem20) no-repeat;
	background-position: 0 -2.3rem;
	background-size: 1.8rem 4.6rem
}
```

## 切图说明
* 把psd中图片所有icon类小图切换，在css中设置好background-position，在相对应图片后面增加?__sprite后缀

## 配置说明
* 默认为开启状态，可以通过config.json的{{output.csssprite}}键值设置为false进行关闭
* 图片之间上下间距可以通过config.json的{{output.cssspriteMargin}}键值设置

## 特性说明
* 支持的图片格式：png，jpg，png输出png24格式，IE6的png24图片需要单独处理
* 支持no-repeat，background-position可自由设置
* 后续支持repeat-x，repeat-y

## 原理解析
* 分析css文件内容，取出带有?__sprite的图片路径，同时对此background的backgroud-repeat、background-position进行记录
* 取出所有图片，依靠backgroud-repeat、background-position进行图片合并，并生成合并的新图片
* 把css文件所有sprite图片路径替换成合并的新图片路径

## 解析css
* 利用正则实现一个简单的css语法解析器，可把css内容解析为

<table>
	<tr><td>属性</td> <td>值</td> <td>说明</td> </tr>
	<tr><td>content</td> <td>图片内容</td> <td></td> </tr>
	<tr><td>url</td> <td>如：i/icon.png</td> <td>图片url</td> </tr>
	<tr><td>item</td> <td>如：background: url(i/icon.png?__sprite) no-repeat</td> <td>图片background</td> </tr>
	<tr><td>repeat</td> <td>null | repeat-x | repeat-y</td> <td>重复</td> </tr>
	<tr><td>width</td> <td>number</td> <td>图片的宽度</td> </tr>
	<tr><td>height</td> <td>number</td> <td>图片的高度</td> </tr>
</table>

## 系统支持
win，mac，linux
