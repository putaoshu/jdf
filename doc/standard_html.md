#jdf html规范

<table>
<tr><td>版本</td> <td> 日期</td> <td> 说明 </td> </tr>
<tr><td>v1.0</td> <td> 2013-12-2</td> <td> 初版</td> </tr>
</table>

## 目的
本文定义了HTML和CSS的格式和样式规则,旨在改善代码协作编码,代码质量和规范基本结构.

## 适用人员
所有前端开发人员或涉及到前端代码的开发人员

## 文件的名称
要有实际意义,可读性强,能够代表代码区块的功能


## 文件的编码
全站默认为utf-8

## html-总体结构
* doctype

        <!DOCTYPE html>
* 编码

        <meta charset="utf-8" />
* 根据业务需要,添加必不可少的keywords,description,title
* 基本原则:先分析布局,划分框架,然后规划结构,最后编写代码

## html-书写布局
* 缩进-使用4个空白符的制表位进行缩进
* 应该按照设计稿的依次顺序,从上至下,从左至右书写
* 两个模块间用空行隔开,使代码看起来比较清晰
* 元素嵌套时,尽量采用一个元素占用一行的原则,如下不太好
        
        <li><a href=""><p><img src="img.jpg"></p></a></li>

## html-元素和属性格式
* 标签都要闭合
* 元素和属性全部小写
* 合理嵌套,如下不合理
        
        <p>this is<em>test</p></em>
* 对非空元素,必须使用结束标签,如下有未结束元素
        
        <p>this is test <p> i am a boy
* 属性值必须在引号中,如

        <td colspan="3">,<input type="text" value="ok" />
* 非成对标记必须以 "/>" 结尾,如
        
        <br/>,<hr/>,<input type="text" />

## html-元素和属性建议
* 一段文字段落可以用p
* 项目列表可以用ul,ol或者dl,尽量避免使用div
* 数据类展示可以使用table,表格头使用thead,尾部使用tfoot
* 元素加重可以使用strong,em
* 代码片断使用pre,code
* 标题使用h1,h2,h3-h6
* 图片元素img要添加title,以及合理添加width和height,减少reflow,并提高体验
* 在截断元素加上完事的title
* radio前面最好添加label,让文字也可选中radio,如
        
        <label><input type="radio" />选项1</label>
* 避免在页面中使用style属性
* 避免使用多层class,如
        
        <div class="class1 class2 class3 class4 class5">
* 建议省略style和script的type属性,如

        <link rel="stylesheet"  href="css.css"/>
        <script src="js.js"></script>


## html-命名规范
* 总体采用中划线"-"的形式,如detail-list
* 避免使用方向命名,如left,right,top,bottom等

## html-命名参考

<table>
<tr><td>login</td> <td>登陆</td> <td>about-me</td> <td>关于我们</td></tr>
<tr><td>usercenter</td> <td>用户中心</td> <td>copyright</td> <td>版权信息</td></tr>
<tr><td>my-order</td> <td>我的订单</td> <td>after-sales-service</td> <td>售后服务</td></tr>
<tr><td>site-map</td> <td>网站导航</td> <td>contact-us</td> <td>联系我们</td></tr>
<tr><td>search-input</td> <td>搜索输入框</td> <td>add-to-cart</td> <td>加入购物车</td></tr>
</table>

## html-注释

* 单行,放在元素上边,如

        <!-- 这是测试 -->
        <p>这是测试的</p>

* 注释区块,注意结束时加"/"
        
        <!-- 这是测试 -->
        ...
        <!--/ 这是测试 -->

## html-常用转义

        显示说明 | 实体名称
        不断行的空白格 | &nbsp;
        < | 小于 | &lt;
        > | 大于 | &gt;
        ' | 单引号 | &#39;
        © | 版权 | &copy;
        ® | 已注册商标 | &reg;
        ™ | 商标（美国） | &trade;
        × | 乘号 | &times; 
        ÷ | 除号 | &divide; 

## html-hack
可以在头部添加如下代码,可以对IE的版本进行区分

        <!--[if lt IE 7 ]> <html class="ie6"> <![endif]-->
        <!--[if IE 7 ]> <html class="ie7"> <![endif]-->
        <!--[if IE 8 ]> <html class="ie8"> <![endif]-->
        <!--[if IE 9 ]> <html class="ie9"> <![endif]-->
        <!--[if (gt IE 9)|!(IE)]><!-->
        <html class="w3c">
        <!--<![endif]-->
