# html/js/css文件lint代码质量检查

## 使用说明

* 方法1：在当前目录中，使用 `jdf lint` 或者 `jdf lint ./test` 可直接检查当前目录或者指定目录下的所有文件。
* 方法2：在当前目录中，使用 `jdf lint test.html` 可直接检查指定的文件。
* 方法3：可直接使用 `jdf lint http://www.jd.com` 检查在线页面。

## 检查html文件

`jdf lint` 可以快速检测html文件中代码的书写错误，比如 `test.html` 的内容如下：

    <div id="box"></div>
    <div id="box"></div>
    
    <input type=text>

运行 `jdf lint test.html` 命令之后，会看到以下提示信息：

    jdf lint:  test/test.html
    #1
    >> line: 9, column: 2
    >> msg: the id "box" is already in use
    #2
    >> line: 10, column: 2
    >> msg: the "type" attribute is not double quoted

很明显，在此hmtl文件中存在两个问题：

* 问题1：页面中有两个元素使用了重复的id
* 问题2：`input` 元素的 `type` 属性值没有加双引号

## 检查css文件

`jdf lint` 可以快速检测css的书写错误，比如 `btn.css` 内容如下：
    
    .btn{
        colo: #fff
        border:1px solid red;
    }

很明显 `.btn` 样式存在两个问题

* 问题1： `colo` 属性是不存在的，可能应该为 `color`
* 问题2： `colo: #fff` 后和 `border:1px solid red;` 前少了一个分号 `;`

此时jdf命令行下会有如下提示，方便查找问题所在

    jdf csslint: There are 2 problems in lib/csslint.css

    #1 warning at line 2, col 2
    Unknown property 'colo'.
        colo: #fff

    #2 error at line 3, col 8
    Expected RBRACE at line 3, col 8.
        border:1px solid red;

注意：less/scss文件需要编译成css后才能检测，否则提示会不准确。

## 检查js文件

`jdf lint` 可快速检测js代码的书写错误，比如 `test.js` 的内容如下：

    function test() {
      var a = 1
    }

运行 `jdf lint test.js` 命令之后，会看到以下提示信息：

    #1
    >> line: 4, column: 12
    >> msg: Expected ";" and instead saw "}".
    >> at:   var a = 1
    #2
    >> line: 4, column: 7
    >> msg: Unused "a".
    >> at:   var a = 1
很明显，在此js文件中有两个问题：

* 问题1：在代码 `var a = 1` 结尾处没有加分号
* 问题2：a变量只是被定义了，却没有被使用

## 注意事项

* 此工具会自动**递归检查**指定目录中所有的html、vm、tpl、css、sass、less、js文件，其它文件会自动忽略。
* 在使用 `jdf lint` 检查在线页面时，url前必须要加上http。
* 默认csslint功能是关闭状态，可以通过config.json的{{build.csslint}}键值设置为true进行开启，这样在 `jdf build` 下会自动检测

## 原理浅析

csslint可用于检查CSS取值和潜在问题，使用了Nicholas大神的npm模块parser-lib作为css解析器，并按照parser-lib给出的API来编写检查规则。
csslint的每一个规则都是通过监听parser-lib给出的事件来进行相应的判断：

* startrule为规则开始
* property为找到一个属性时的事件 
* endrule为一个规则结束

一旦规则结束并且没有统计到任何property，则说明规则为空。
