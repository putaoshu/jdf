#jdf js规范

<table>
<tr><td>版本</td> <td> 日期</td> <td> 说明 </td> </tr>
<tr><td>v1.0</td> <td> 2013-12-2</td> <td> 初版</td> </tr>
</table>

##目的
使团队成员代码风格统一,维护更新便捷

##命名原则
* 命名要有实际的意义
* 命名应该,可读性强,代表代码的功能,如getUserName

##命名规范
* 所有变量必须使用英文名称
* 一般变量,使用驼峰命名,如var pageConfig;
* 常量,全部大写,如var USER_ID;
* 方法的命名必须为动词或者是动词短语,如obj.getSomeValue()
* 变量如果设置为私有,则前面必须添加下划线,如:this._somePrivateVariable = statement;
* 避免使用含有类广告关键词的命名,如ad,ads,guanggao等等
* 避免使用含有js语法关键词的命名,如if,else,switch,break,return,while等等
* 避免使用含糊不清的命名,如mouseEventHandler,而非mseEvtHdlr
* 避免使用产生歧义的布尔变量名称,如isNotError

##特殊命名
* 前面加"is"的变量名应该为Boolse值,同理可以使用"has","can"等
* 重复变量建议使用"i","j","k"等等名称
* 方法名称建议: get/set,add/remove,insert/delete,create/destroy,start/stop,begin/end等等
* 能缩写的名称尽量使用缩写

##变量
* 变量声明都要加上var关键字
* 变量必须在声明初始化后才能使用,即便是NULL类型
* 相关的变量应该放在同一代码区块中
* 循环变量应该初始化
* 尽量避免使用非常复杂的条件表达式
* 变量需要有相对较广的作用域时,建议设计成一个类的成员


##布局

###缩进
* 使用4个空白符的制表位 

###语句块

* if---else语句应该类似这样
        
        if (something){
             doSomething(1);
        } else if {
             doSomething(2);
        } else {
             doSomething(3);
        }

* whild语句应该类似这样
        
        while (something){
             doSomething();
        }

* for语句应该类似这样
        
        for (var i = 0, k = 10; i < k ; i++ ){
             doSomething();
        }


* switch语句应该类似这样

        switch (){
             case a:
                  doA();
                  return ;
             case b:
                  doB();
                  return ;
             default:
                  todo();
                  return ;
        }

* try--catch语句应该类似这样
        
        try {
             doSomething(1);
        } catch (e) {
             doSomething(2);
        }

* 单行if-else必须加入括号
    
        if (something){ todo();}

* 长语句要加换行符
如

        $('.list').eq(0).css({zIndex:1,width:100,height:100}).stop(true).animate({opacity:1,width:1000,height:1000},500);
不如

        $('.list').eq(0)
        .css({
             zIndex:1,
             width:100,
             height:100
        })
        .stop(true)
        .animate({
             opacity:1
        },500);

* 参数格式化
如 

        el.css({left:1,top:0,width:100,height:200})
不如 
     
        el.css({
          left:1,
          top:0,
          width:100,
          height:200
        })
   
##空格
* 操作符使用 "空格"隔开
* 下列关键字必须使用空格隔开,如 case,default,delete,function,in,new,throw,typeof,var
* 等号 = 前后建议使用空格隔开
* 逗号 , 建议使用空格隔开
* 冒号 : 建议使用空格隔开
* 点 .  在后部建议使用空格隔开
* ? 和 : 三目运算符前后应该使用空格隔开
* 逻辑块之间使用空行
* 函数调用和方法避免使用空白,例如: doSomething(someParameter);而非 doSomething (someParameter)

##注释规范
* 无论是已解决的方案还是未开发的功能,注释"必须"与代码相关
* 大量的变量声明后面,应该加跟随一段注释
* 注释主要是要说明接下来一段的代码段的用处
* 注释仅在必要的时候添加,完全"没有必要"每行都添加
* 单行注释

        放在代码上面
        //这是注释
        var i = 100;

* 文件和逻辑块注释
jsdoc语法参考,更多http://usejsdoc.org/#JSDoc3_Tag_Dictionary

        /**
        * 展示不同类型的面板
        * @param {String} type 类型的实际值
        * @return {Object} 返回值为一个对象
        * @todo 指出应该改进或者将来要实现的功能
        */ 
     
* markdown语法参考,更多http://daringfireball.net/projects/markdown/syntax

        /**
        *####返回顶部####
        * 
        ***Demo**
        * [gotop](../demo/gotop/gotop.html "Demo")
        *
        ***参数**
        *
        *  - `scrollTop` {Number} 50  滚动条高度达到此高度时显示
        *
        ***举例**
        * 
        *   $('#gotop').gotop({
        *       scrollTop:300
        *   });
        *
        */

