# smarty模版

## 设计原则
让前端来写后端的smarty模板，并且前端不需要搭建各种繁杂的后端环境，另外模板的数据源可以在项目开始前前后端约定之后生成JSON文件，从而使两个角色并行开发。

## 使用方法：
<div>1、将widget中的模版扩展名改为`.smarty`</div>
<div>2、将模版需要渲染的数据，放在当前widget下的`.json`文件或者widget标签的data属性中</div>
<div>3、引用方式：`{%widget name="test"%}`</div>
<div>4、单独引用模版：`{%widget name="test" tydive="smarty"%}`</div>

## smarty基本语法
* 变量
Smarty有几种不同类型的变量，变量的类型取决于它的前缀是什么符号（或者被什么符号包围）
Smarty的变量可以直接被输出或者作为函数属性和修饰符(modifiers)的参数,或者用于内部的条件表达式等等。
如果要输出一个变量,只要用定界符将它括起来就可以，例如:
```text
{$Name} 
{$Contacts[row].Phone}
```

* if,else判断
```text
{if $name eq "Fred"}
    Welcome Sir.
{elseif $name eq "Wilma"}
    Welcome Ma'am.
{else}
    Welcome, whatever you are.
{/if}
```

* selection循环遍历
模板的section用于遍历数组中的数据。section标签必须成对出现，必须设置name和 loop属性。名称可以是包含字母、数字和下划线的任意组合，可以嵌套但必须保证嵌套的 name唯一。
变量loop（通常是数组）决定循环执行的次数。当需要在section循环内输出变量时，必须在变量后加上中括号包含着的name变量。
```text
{section name=customer loop=$custid}
    id: {$custid[customer]}<br>
{/section}

OUTPUT:

id: 1000<br>
id: 1001<br>
id: 1002<br>
```
