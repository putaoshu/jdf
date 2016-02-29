# smarty模版

## 设计原则
让前端来写后端的smarty模板，并且前端不需要搭建各种繁杂的后端环境，另外模板的数据源可以在项目开始前前后端约定之后生成JSON文件，从而使两个角色并行开发。

## 使用方法：
<div>1、将widget中的模版扩展名改为`.smarty`</div>
<div>2、将模版需要渲染的数据，放在当前widget下的`.json`文件或者widget标签的data属性中</div>
<div>3、引用方式：`{%widget name="test"%}`</div>
<div>4、单独引用模版：`{%widget name="test" tydive="smarty"%}`</div>
