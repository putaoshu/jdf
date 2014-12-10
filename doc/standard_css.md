#jdf css规范

<table>
<tr><td>版本</td> <td> 日期</td> <td> 说明 </td> </tr>
<tr><td>v1.0</td> <td> 2013-12-2</td> <td> 初版</td> </tr>
</table>

##目的
本文定义了HTML和CSS的格式和样式规则,旨在改善代码协作编码,代码质量和规范基本结构.

##适用人员
所有前端开发人员或涉及到前端代码的开发人员

##css-文件引入方法

    <link type="text/css" rel="stylesheet"  href="x.css"/>
##css-最佳实践
* 属性尽量写在一行内,如.test{...}
* 属性书写顺序:按照元素模型由外及内,由整体到了细节,大致如下:
  * 位置: postion,top,left,right,bottom,flot
  * 盒模型属性:margin,padding,width,height
  * 边框和背景:border,background,
  * 段落与文本:font,text-align,line-height,color,text-indent,text-decoration
  * 其它属性z-index,opcity
* 选择符,属性,值均用小写
* 尽可能使用class复用样式,不可无限制的使用id
* 属性缩写,如
      
        #ff0000可缩写成#f00,margin:0 auto;
* css3新特性兼容webkit内核浏览器和firefox浏览器
    
        border-radius:5px;/*标准写法*/
        -moz-border-radius:5px; /*firefox浏览器*/
        -webkit-border-radius:5px;/*webkit内核浏览器*/
* 单个模块的所有样式应该加前缀,如.mod-produce-list a{} .mod-produce-list .more{}
* 避免使用低效耗性能的写法,如div ul li a span{...}
* 选择器合并,即为了复用可以一次定义多个选择器,如.mod-hd,.mod-bd,.mod-ft{...}
* 尽量避免使用!important
* 建议使用如下:    
  * 表示结构:mod-wrap,mod-body,mod-hd,mod-bd,mod-ft
  * 表示区域:mod-header,mod-side,mod-nav,mod-footer

##css-hack使用规则

* 使用原则: 仅必要时才采用hack

        background-color:blue;  /* not ie */
        background-color:red\9;     /*all ie*/
        background-color:yellow\0;  /*ie8*/
        *background-color:green;  /*ie7,ie6*/
        +background-color:pink;  /*ie7*/
        _background-color:orange;  /*ie6 */
         
##css-注释

* 放在元素上面,如

        /*这是测试*/
        .test{}

* 区块

        /**
        *描述
        */


##css-常见bug

* [IE6] 双倍margin 解决方案-设置为inline-block http://www.positioniseverything.net/explorer/doubled-margin.html 
* [IE6] 小于10px,解决方案-增加_overflow:hidden;
* [<　IE7] button有比较大的默认宽度,解决方案-增加*overflow:visible
* [<　IE8] 浮动的元素排序起来就像一个楼梯 http://haslayout.net/css/Staircase-Bug
* [chrome] chrome字体不能小于12px,解决方案-增加-webkit-text-size-adjust:none;

##css-兼容写法小技巧

* 设置透明度

        opacity:0.6;-moz-opacity:0.6;filter:alpha(opacity:60);
* inline-block 

        display:inline-block;display:-moz-inline-stack;*display:inline;*zoom:1;
* max-height 

        max-height:45px;_height:expression(this.scrollHeight > 45 ? "45px" : "auto");
* min-height

        min-height:45px;height:auto !important;height:45px;
* 已知高度垂直距中
  
        position:relative;top:50%;margin-top:-30px; /*30为已知元素高度60px的一半*/
