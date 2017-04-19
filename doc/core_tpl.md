# js前端模板

## 变量

	var data = {name: 'lilei'}; 
	var str = "<h3><%=name%></h3>"; 
	console.log($.tpl(str, data)); // => <h3>lilei</h3>

## 循环

	var data2 = {
		title:'listArray',
		list:[
			{ username:'tom',sex:1},
			{ username:'lili',sex:0}
		]
	};

	var str2 = '<div>'
	+'	<h1 class="header"><%=title%></h1>'
	+'	<ul class="list">'
	+'		<%for(var i = 0;i<list.length;i++){%>'
	+'		<li class="item">'
	+'			<%=list[i].username%>'
	+'			性别：<%if (list[i].sex){%>男<%}else{%>女<%}%>'
	+'		</li>'
	+'		<%}%>'
	+'	</ul>'
	+'</div>';

	console.log($.tpl(str2, data2));
