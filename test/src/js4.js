// "
seajs.use(["a.js","/widget/b.js"],function(a,b){});
seajs.use(["a.js","/app/js/b.js"],function(a,b){});
seajs.use("a.js",function(a){});
seajs.use("a",function(a){});
// '
seajs.use(['a.js','/widget/b.js'],function(a,b){});
seajs.use(['a.js','/app/js/b.js'],function(a,b){});
seajs.use(['a.js','app/js/b.js'],function(a,b){});
seajs.use('a',function(a){});
seajs.use('a',function(){});
