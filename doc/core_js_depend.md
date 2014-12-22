#js依赖管理方案

seajs的config中base所有项目统一设置假设为 http://cdn.com/

示例 (假设工程名为jdf_dependent)

* widget js文件使用require
		
		本地 require('/widget/test/test.js') ==> 工具编译后 require('jdf_dependent/widget/test/test.js')
		实现请求url为 http://cdn.com/jdf_dependent/widget/test/test.js

* widget js文件使用use
		
		本地 seajs.use('/widget/test/test.js') ==> 工具编译后 seajs.use('jdf_dependent/widget/test/test.js')
		实现请求url为 http://cdn.com/jdf_dependent/widget/test/test.js

* widget js中使用ui, unit组件调用方式如下 (注意不要加/, 因为这个是基于base, 所以编译不做处理)
		
		seajs.use('product/index/js/base/ui/accordion/accordion') ==> 工具编译后 seajs.use('product/index/js/base/ui/accordion/accordion')
		require('product/index/js/base/ui/accordion/accordion') ==> 工具编译后 require('product/index/js/base/ui/accordion/accordion')
		实现请求url为 http://cdn.com/product/index/js/base/ui/accordion/accordion.js

* js中使用调用方式如下 (注意不要加/, 因为这个是基于base)
		
		seajs.use('/js/test.js') ==> 工具编译后 seajs.use('jdf_dependent/js/test.js')
		require('/js/test.js') ==> 工具编译后 require('jdf_dependent/js/test.js')
		实现请求url为 http://cdn.com/jdf_dependent/js/test.js
