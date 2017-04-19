# html/js/css文件格式化

## 使用说明

* 方法1：在当前目录中，使用 `jdf format` 或者 `jdf format ./test` 可直接格式化当前目录或者指定目录下的所有文件。
* 方法2：在当前目录中，使用 `jdf format test.html` 可直接格式化指定的文件。

## 使用示例

`jdf format` 可快速格式化文件中的代码格式，比如 `test.html` 的内容如下：

        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <title>Document</title>
        </head>
        <body>
        <div>
        <p><span><a href="#">jdf format</a></span></p>
        </div>
        <style>
        .box{font-size: 20px;font-style: bold;color: blue;}
        </style>
        <script>
        function test(a) {var a = 2;console.log('jdf format')}
        </script>
        </body>
        </html>

执行 `jdf format test.html` 或者 `jdf f test.html` 命令之后，此文件的代码会被格式化成：

        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Document</title>
        </head>
        <body>
            <div>
                <p><span><a href="#">jdf format</a></span>
                </p>
            </div>
            <style>
                .box {
                    font-size: 20px;
                    font-style: bold;
                    color: blue;
                }
            </style>
            <script>
                function test(a) {
                    var a = 2;
                    console.log('jdf format')
                }
            </script>
        </body>
        </html>

## 注意事项

* 此工具会自动**递归格式化**指定目录中所有的html、vm、tpl、css、sass、less、js文件，其它文件会自动忽略，请谨慎指定目录。
* 此工具会同时格式化html文档中包含的所有html、css、js代码。
* 格式化后的代码会被覆盖保存到原文件中。