/**
 * @文件压缩
 * @see
 *
 * UglifyJS: uglify-js 
 * homePage: 
 * 配置 http://lisperator.net/uglifyjs/codegen
 * 配置2 http://lisperator.net/uglifyjs/compress
 * 
 * CleanCSS: clean-css
 * 配置 https://github.com/GoalSmashers/clean-css#how-to-use-clean-css-programmatically
 * 
 * Pngquant: node-pngquant-native
 *
 */

var path = require('path');
var fs = require('fs');
var requirejs = require('requirejs');

//lib自身组件
var $ = require('./base.js');
var f = require('./file.js');
var jdf = require('./jdf.js');
var base64 = require('./base64.js');

//外部组件
var UglifyJS = require("uglify-js");
var CleanCSS = require('clean-css');
// var Pngcrush = require('node-pngcrush');
// var Pngquant = require('jdf-png-native');
var Htmlminify = require('html-minifier').minify;

//exports
var compress = module.exports = {};

/**
 * @文件压缩初始化
 * @time 2014-2-14 16:19:18
 * @param src 输入文件/文件夹相对路径,无dest默认compress src
 * @param dest 输出文件/文件夹相对路径
 */
compress.dir = function(src, dest) {
    if (typeof(src) == 'undefined') {
        console.log('jdf warning no src folder');
        return;
    }

    var srcPath = path.normalize(f.currentDir() + '/' + src);
    var destPath;

    if (typeof(dest) == 'undefined') {
        destPath = srcPath;
    } else {
        destPath = path.normalize(f.currentDir() + '/' + dest);
        f.copy(srcPath, destPath);
    }

    compress.init(destPath);

    console.log('jdf compress success!');
}

/**
 * @文件/文件夹压缩
 * @param {String} rSource 文件/文件夹绝对路径
 * @param {Boolse} isdebug debug模式true时不压缩代码,仅处理路径
 * @param {Object} config 多线程传参数jdf.config
 * @param {Function} getProject 多线程传参数jdf.getProject
 */
compress.init = function(rSource, isdebug, config, getProject, callback) {
    if (typeof(config) != 'undefined') jdf.config = config;
    if (typeof(getProject) != 'undefined') jdf.getProject = getProject;

    var isdebug = isdebug || false;
    var allTag = true;
    var source = f.realpath(rSource);
    if (source) {
        if (f.isDir(source)) {
            fs.readdirSync(source).forEach(function(name) {
                if (name != '.' && name != '..' && !(/.svn/.test(name))) {
                    allTag = compress.init(source + '/' + name, isdebug) && allTag;
                }
            });
        } else if (f.isFile(source)) {

            //html minify
            if ($.is.html(source) && (jdf.config.output.compresshtml||!jdf.config.output.comment||jdf.config.output.htmlContentReplace) ){
                if(jdf.config.build.hasCmdLog) console.log('compress.html---'+source);
                var sourceCode = f.read(source);

                //html remove comment
                if (!jdf.config.output.comment) {
                    var htmlComment = $.reg.htmlComment();
                    sourceCode = sourceCode.replace(htmlComment, '').replace(/\n\s*\r/g, '');
                }
                
                //html contentReplace
                if (jdf.config.output.htmlContentReplace || 
                    jdf.config.output.htmlContentReplaceInProduce || 
                    jdf.config.output.htmlContentReplaceInPublish
                ) {
                    var r = jdf.config.output.htmlContentReplace;
                    if(jdf.config.outputType == 'prod' && jdf.config.output.htmlContentReplaceInProduce) r = jdf.config.output.htmlContentReplaceInProduce
                    if(jdf.config.outputType == 'pub' && jdf.config.output.htmlContentReplaceInPublish)r = jdf.config.output.htmlContentReplaceInPublish

                    for (var i=0; i<r.length; i++){
                        var ri = new RegExp(r[i].from, 'gm');
                        sourceCode = sourceCode.replace(ri, r[i].to);
                    }
                }

                //html compress
                if (jdf.config.output.compresshtml && !isdebug) {
                    sourceCode = compress.html(sourceCode, isdebug);
                }

                f.write(source, sourceCode);
            }

            //js UglifyJS
            if ($.is.js(source) && !jdf.config.build.es6Entry ) {
                if (jdf.config.output.rjs) {
                    var outputdir = path.normalize(f.currentDir() + '/' + jdf.config.outputDirName + '/' + jdf.getProjectPath());
                    requirejs.optimize({
                        appDir: outputdir,
                        allowSourceOverwrites: true,
                        keepBuildDir: true,
                        dir: outputdir
                    }, function() {}, function(error) {})
                } else {
                    if (jdf.config.output.compressJs) {
                        var sourceCode = compress.js(source, isdebug);
                        f.write(source, sourceCode);
                    }

                    var sourceCode = compress.addJsDepends(source);
                    f.write(source, sourceCode);

                    //jsContentReplace
                    if (jdf.config.output.jsContentReplace || 
                        jdf.config.output.jsContentReplaceInProduce || 
                        jdf.config.output.jsContentReplaceInPublish
                    ) {
                        var r = jdf.config.output.jsContentReplace;
                        if(jdf.config.outputType == 'prod' && jdf.config.output.jsContentReplaceInProduce) r = jdf.config.output.jsContentReplaceInProduce
                        if(jdf.config.outputType == 'pub' && jdf.config.output.jsContentReplaceInPublish)r = jdf.config.output.jsContentReplaceInPublish
                        var sourceCode = f.read(source);
                        for (var i=0; i<r.length; i++){
                            var ri = new RegExp(r[i].from, 'gm');
                            sourceCode = sourceCode.replace(ri, r[i].to);
                        }
                        f.write(source, sourceCode);
                    }
                }
            }

            //css CleanCSS
            if ($.is.css(source) && jdf.config.output.compressCss) {
                var sourceCode = compress.css(source, isdebug);
                f.write(source, sourceCode);
            } else if ($.is.css(source)) {
                var sourceCode = compress.css2(source, isdebug);
                f.write(source, sourceCode);
            }

            //png optimize
            if ($.is.png(source) && !isdebug && jdf.config.output.compressPng) {
                compress.png(source, source);
            }

            //css中图片url增加域名前缀
            if (jdf.config.output.cssImagesUrlReplace && $.is.css(source)) {
                var sourceCode = compress.cssImagesUrlReplace(source, sourceCode, jdf.config.cdn);
                f.write(source, sourceCode);
            }

            //图片base64
            if (jdf.config.output.base64 && ($.is.sass(source) || $.is.less(source) || $.is.css(source))) {
                var sourceCode = base64.init(source);
                f.write(source, sourceCode);
            }

            //图片webp
            if (jdf.config.output.webp) {
                //css webp样式追加
                if ($.is.css(source)) {
                    compress.appendWebpCSSFIX(source);
                }

                //图片格式转换
                if ($.is.jpg(source) || $.is.png(source)) {
                    compress.webp(
                        source,
                        source + ".webp",
                        jdf.config.output.webpQuality ? jdf.config.output.webpQuality : 80,
                        function(status) {
                            if (callback) {
                                callback(status);

                            }
                        }
                    );
                } else {
                    if (callback) callback();
                }
            } else {
                if (callback) callback();
            }

        } else {
            allTag = false;
            if (callback) callback(false);
        }
    } else {
        if (callback) callback(false);
        //console.log('error');
    }
    return allTag;
}

/**
 * @js文件依赖替换
 * @time 2014-2-21 18:46:24
 * @param source 文件名
 * @param source 文件内容
 * 
 *   var a=require('a.js') ==> var a=require('projectPath/a.js')
 *
 *   define('/a.js',function(require, exports) {});  ==>
 *   define('projectPath/a.js', ['projectPath/b.js'], function(require, exports) {});
 *
 *  define(function(require, exports)) ==> 
 *  define('projectPath/a.js',['projectPath/b.js'],function(require, exports))
 *
 *  seajs.use(['/a.js', '/b.js'],function(){}) ==> 
 *  seajs.use(['projectPath/a.js', 'projectPath/b.js'],function(){})
 * 
 */
compress.addJsDepends = function(source) {
    var sourceCode = f.read(source);
    var cdn = jdf.config.cdn;
    var configBaseDir = jdf.config.baseDir ? jdf.config.baseDir + '/' : '';
    var dependenceArray = [];
    var arr = sourceCode.match(/require\s*\(\s*("|')(.*?)("|')\s*\)/gmi);

    //js文件的id和dependences是否添加cdn前缀 默认是不添加的
    if(jdf.config.output.jsUrlReplace == false){
        cdn = "";
    }

    if (arr) {
        for (var i = 0; i < arr.length; i++) {
            var temp = arr[i].match(/require\((.*?)\)/);
            if (temp) {
                temp[1] = temp[1].replace(/'|"/g, '');
                var match = temp[1];
                //无.js缀和不含有.css的url加.js
                if (!(/\.js$/i.test(match)) && !/\.css/i.test(match)) {
                    match += '.js';
                }
                //add prefix
                if (/^\//.test(match) && !$.is.httpLink(match)) {
                    match = match.replace(configBaseDir, '');
                    match = jdf.getProjectPath() + match;
                }

                if (cdn && !$.is.httpLink(match)) {
                    match = (cdn + '/' + match);
                }

                //source content require add prefix
                //var a=require('a.js') ==> var a=require('projectPath/a.js')
                sourceCode = sourceCode.replace(arr[i], 'require("' + match + '")');
                dependenceArray.push('"' + match + '"');
            }
        }
    }
    dependenceArray = dependenceArray.join(',');

    /**
     * @has file id add dependenceArray
     * @example
     *   define('/a.js',function(require, exports) {});  ==>
     *   define('projectPath/a.js', ['projectPath/b.js'], function(require, exports) {});
     */
    if (dependenceArray.length > 0) {
        //insert 
        var arrTemp = /(define\(.*?["|'].*?["|']).*?,function/m.exec(sourceCode);
        var strTemp = arrTemp ? arrTemp[1] : null;
        if (strTemp) {
            // source = source.replace(strTemp, strTemp+','+'['+dependenceArray+']');
        }
    }

    /**
     * @add files id and dependenceArray
     * @example  
     *  define(function(require, exports)) ==> 
     *  define('projectPath/a.js',['projectPath/b.js'],function(require, exports))
     */
    if (f.filter(source, '(js)$', jdf.config.build.isEs6Exclude)) {
        if (/define\(function/gm.exec(sourceCode)) {
            //getProjectPath
            var filepath = source.split(jdf.config.outputDirName + '/' + jdf.getProjectPath());
            var filename = null;
            if (filepath && filepath.length > 1) {
                filename = filepath[1].replace(configBaseDir, '');

                var getProjectPath = jdf.getProjectPath() ? jdf.getProjectPath() + '/' : '';
                if(jdf.config.output.jsUrlReplace == false || jdf.config.cdn){
                    filename = getProjectPath + filename;
                }else{
                    //不加cdn前缀 也不加projectPath 即保持默认的路径
                    filename = '..'  + filename;
                }

            };

            if (!filename) {
                filename = path.basename(source);
            }

            //del // prefix
            filename = filename.replace(/\/\//g, '/');
            if (dependenceArray.length == 0) {
                dependenceArray = '';
            }

            if (cdn && !($.is.httpLink(filename))) {
                filename = cdn + '/' + filename;
            }

            sourceCode = sourceCode.replace('define(function', 'define("' + filename + '",[' + dependenceArray + '],function');
        }
    }

    /**
     * @seajs.use add prefix 
     * @example  
     *  seajs.use(['/a.js', '/b.js'],function(){}) ==> 
     *  seajs.use(['projectPath/a.js', 'projectPath/b.js'],function(){})
     */
    var hasSeajs = sourceCode.match(/seajs\.use\((.*?),\s*function/gim);
    if (hasSeajs) {
        //去重obj
        var tempObj = {};

        for (var i = 0, j = hasSeajs.length; i < j; i++) {
            var t = hasSeajs[i].replace(/seajs.use\(|\[|\]|,function/gim, '');
            var t1 = t.split(',');
            if (t1) {
                for (var m = 0; m < t1.length; m++) {
                    //get origin source
                    var t2 = t1[m].replace(/[\"\'\s]/g, '');
                    var t3 = t2.replace(configBaseDir, '');

                    if (!$.is.httpLink(t2)) {
                        if (/^\//.test(t2)) {
                            if (cdn) {
                                tempObj[t2] = cdn + '/' + jdf.getProjectPath() + t3;
                            } else {
                                tempObj[t2] = jdf.getProjectPath() + t3;
                            }

                        } else if (!/^\.\//.test(t2) && !/^\.\.\//.test(t2)) {
                            if (cdn) {
                                tempObj[t2] = cdn + '/' + t3;
                            } else {
                                tempObj[t2] = t3;
                            }
                        }
                    }
                }
            }
        }
        for (var i in tempObj) {
            var reg = new RegExp('["\']' + i + '["\']', 'gim');
            sourceCode = sourceCode.replace(reg, '"' + tempObj[i] + '"');
        }
    }

    return sourceCode;
};

/**
 * @增加前缀banner
 * @return {String} /* projectPath - Date:2014-03-13 13:06:12:120 * /
 */
compress.setPrefixBanner = function(bannerType, source, result) {
    var projectPath = jdf.getProjectPath() ? jdf.getProjectPath().replace('/', '-') + ' ' : '';
    var basename = path.basename(source);
    var banner = '';

    if (bannerType == 1) {
        banner = '/* ' + projectPath + basename + ' Date:' + $.getDay('-') + ' ' + $.getTime(':', false) + ' */\r\n';
    }

    if (bannerType == 2) {
        banner = '/* ' + projectPath + basename + ' md5:' + $.md5(result) + ' */\r\n';
    }

    return banner;
}

/**
 * @html文件压缩
 * @param sourceCode 文件内容
 */
compress.html = function(sourceCode) {
    if(sourceCode){
        sourceCode = Htmlminify(sourceCode, {
            removeComments: true, //移除注释
            collapseWhitespace: true, //合并多余的空格
            minifyJS: true, //压缩文件中的js代码
            minifyCSS: true //压缩文件中的css代码
        });
    }
    return sourceCode;
}

/**
 * @js文件压缩
 * @param source 文件/文件夹路径
 * @return compress code
 */
compress.js = function(source, isdebug) {
    if(jdf.config.build.hasCmdLog) console.log('compress.js---'+source);

    var isdebug = isdebug || false;
    if (!f.exists(source)) {
        return;
    }
    var sourceContent = f.read(source);
    //sourceContent = compress.addJsDepends(sourceContent);

    var options = {
        remove: [], //
        except: ['require', 'define'], //不压缩的字符名
        ascii_only: true, //输出Unicode characters
        beautify: false, //美化代码
        warnings: false //显示压缩报错
            //,mangle: false//是否压缩 失效的参数
    };

    if (jdf.config.output.jsRemove) {
        options.remove = jdf.config.output.jsRemove;
    }

    var result = sourceContent;

    try {
        if (!isdebug) {
            //parse
            UglifyJS.base54.reset();
            var toplevel = UglifyJS.parse(sourceContent);
            toplevel.figure_out_scope();
            var compressorOption = {
                hoist_funs: false, //函数声明至顶端
                //fromString: true,  //说明代码源的格式是否为字符串
                //mangle: true,      //是否压缩,只要配置就不压缩了
                warnings: false, //显示压缩报错
                join_vars: false
            }
            if (options.warnings) {
                compressorOption.warnings = options.warnings;
            }

            //remove console.log
            var matchRemoveOption = function(host, method) {
                return !options.remove.every(function(element) {
                    if (element.indexOf(".") == -1) {
                        return element != host;
                    }
                    return element != host + '.' + method;
                });
            }
            var removeConsoleTransformer = new UglifyJS.TreeTransformer(function(node, descend) {
                if (node instanceof UglifyJS.AST_Call) {
                    var host, method;
                    try {
                        host = node.expression.start.value;
                        method = node.expression.end.value;
                    } catch (err) {

                    }

                    if (host && method) {
                        if (matchRemoveOption(host, method)) {
                            return new UglifyJS.AST_Atom();
                        }
                    }
                }
                descend(node, this);
                return node;
            });
            toplevel = toplevel.transform(removeConsoleTransformer);

            var compressor = UglifyJS.Compressor(compressorOption);
            toplevel = toplevel.transform(compressor);
            toplevel.mangle_names({ except: options.except });

            //output, has /*$ */ comments
            var stream = UglifyJS.OutputStream({
                comments: function(scope, comment) {
                    if (isdebug) {
                        return true;
                    } else {
                        if (comment.type == 'comment2' && comment.value.charAt(0) === '$' && options.copyright) {
                            return comment;
                        }
                        return false;
                    }
                },
                space_colon: false,
                //quote_keys: true, object keys加引号
                beautify: options.beautify,
                ascii_only: options.ascii_only
            });

            toplevel.print(stream);
            result = stream.get();
        }

        //增加前缀banner
        if (!isdebug) {
            result = compress.setPrefixBanner(jdf.config.output.hasBanner, source, result) + result + '\r\n';
        }
    } catch (e) {
        if (e && e.message) {
            console.log('jdf error [compress.js] - ' + source + ' , line:' + e.line + ', ' + e.message);
        }
    }
    return result;
};


/**
 * @css文件压缩
 * @param source 文件/文件夹路径
 * @return compress code
 */
compress.css = function(source, isdebug) {    
    var isdebug = isdebug || false;

    if (!f.exists(source)) {
        return;
    }
   if(jdf.config.build.hasCmdLog) console.log('compress.css---'+source);

    var sourceCode = f.read(source);
    var result = sourceCode;
    if (!isdebug) {
        result = new CleanCSS({
            aggressiveMerging: false, //disable aggressive merging of properties.
            keepBreaks: false, //是否有空格
            processImport: false, //是否替换@import
            compatibility: '*'
        }).minify(sourceCode);
    }

    if (jdf.config.output.imagesSuffix) {
        result = compress.imagesSuffix(source, result);
    }

    //增加前缀banner
    result = compress.setPrefixBanner(jdf.config.output.hasBanner, source, result) + result + '\r\n';

    return result;
};

compress.css2 = function(source, isdebug) {
   if(jdf.config.build.hasCmdLog) console.log('compress.css2---'+source);

    var isdebug = isdebug || false;

    if (!f.exists(source)) {
        return;
    }
    var sourceCode = f.read(source);
    var result = sourceCode;
    if (jdf.config.output.imagesSuffix) { //替换imagesSuffix情况下的image名称
        result = compress.imagesSuffix(source, result);
    }
    return result;
}

/**
* css中图片路径替换
* @time 2014-2-21 10:17:13
* @param cdn 前缀
* @param prefix css目录前缀
* @param suffix 后缀 
* @example 
    cssImagesUrlReplace('.test{background-image:url("i/test.jpg");}','http://cdn.com/','?time=123') ===> 
    .test{background-image:url("http://cdn.com/i/test.jpg?time=123");}
*/
compress.cssImagesUrlReplace = function(source, str, cdn, prefix, suffix) {

    //是否为widget中的css文件
    var isWidgetCssFileReg = new RegExp("/" + jdf.config.widgetDir + "/", "igm");
    var isWidgetCssFile = isWidgetCssFileReg.test(source);

    var suffix = jdf.config.suffix;

    var imagesSuffix = jdf.config.output.imagesSuffix;

    var cssImagesUrlReg = new RegExp("url\\(.*?\\)", "igm");
    var temp = str.match(cssImagesUrlReg);

    var sourcedir = path.normalize(path.dirname(source));
    var outputdir = path.normalize(f.currentDir() + '/' + jdf.config.outputDirName);

    var prefix = sourcedir.replace(outputdir, '');
    //项目在C盘,build在D盘
    prefix = prefix.replace(path.normalize(jdf.config.outputDirName), '');

    // \替换成/
    prefix = prefix.replace(/\\/g, '/');
    prefix = '/' + prefix + '/';
    // //替换成/
    prefix = prefix.replace(/\/\//gim, '/');

    if(!jdf.config.cdn){
        prefix = '';
    }

    if (temp) {
        var tempObj = {};
        //去重
        for (var i = temp.length - 1; i >= 0; i--) {
            if ($.is.imageFile(temp[i])) {
                tempObj[temp[i]] = 1;
            }
        }

        for (var i in tempObj) {
            var b = i;
            b = b.replace('url(', '');
            b = b.replace(')', '');
            b = b.replace(/\s/g, '');
            b = b.replace(/\"/g, '');
            b = b.replace(/\'/g, '');

            if (b != 'about:blank' && !$.is.httpLink(b) && !/data:image/.test(b)) {

                var bOrigin = b;

                var c = b.replace(/\.\.\//g, "");
                c = c.replace(/(^\.\/)/, "");

                var hasWidget = new RegExp("^/" + jdf.config.widgetDir, "igm");
                if (hasWidget.test(b)) {
                    // /widget/aaa 替换
                    c = cdn + '/' + jdf.getProjectPath() + '/' + c;
                } else {
                    if (jdf.config.baseDir) {
                        // /css/ replace其中的/app/
                        c = c.replace('/' + jdf.config.baseDir + '/', "");
                        // /css/ replace其中的 app/
                        c = c.replace(jdf.config.baseDir + '/', '');
                    }

                    if (isWidgetCssFile) {
                        var hasCss = new RegExp(jdf.config.cssDir, "igm");
                        //widget中样式引用css中的图片
                        if (hasCss.test(c) && c.indexOf('/') == 0) {
                            c = cdn + '/' + $.replaceSlash(jdf.getProjectPath() + '/' + c);
                        } else {
                            c = cdn + $.replaceSlash(prefix + c);
                        }
                    } else {
                        c = c.replace(jdf.config.cssDir + '/', "");
                        c = cdn + $.replaceSlash(prefix + c);
                    }
                }

                bOrigin = bOrigin.replace('/', '\\\/').replace('?__sprite', '\\?__sprite').replace(/\?/g, '\\?');
                var sReg = new RegExp('url\\("{0,1}' + bOrigin + '"{0,1}\\)', 'gim');
                str = str.replace(sReg, 'url(' + c + ')');
            }
        };
    };

    return str;
}

compress.imagesSuffix = function(source, str) {
    var imagesSuffix = jdf.config.output.imagesSuffix;
    var suffix = jdf.config.suffix;

    if (imagesSuffix == 1) {
        str = str.replace(new RegExp('\\.png\\?__sprite', 'gmi'), '.png?__sprite' + suffix);
    } else if (imagesSuffix == 2) {
        str = str.replace(/\.png\?__sprite/gmi, suffix + '.png?__sprite');
    }

    return str;
}


/**
@method Pngquant优化png图片
@option {String} source 输入文件路径
@option {String} target 输出文件路径
@option {Boolse} false 是否显示log
**/
compress.png = function(source, target, haslog) {
   if(jdf.config.build.hasCmdLog) console.log('compress.png---'+source);

    var compressPngReg = jdf.config.output.compressPngReg;
    if (f.filter(source, false, compressPngReg)) {
        var buffer = fs.readFileSync(source);
        var options = {};
        if (typeof(haslog) != 'undefined') {
            options.params = '-v --iebug';
        }
        // buffer = Pngquant.option(options).compress(buffer);
        fs.writeFileSync(target,buffer);
    }
};


/**
@method 将png jpg 转为 webp 格式
@option {String} source 输入文件路径
@option {String} target 输出文件路径
@option {Number} quant 压缩质量
@option {Function} callback 回调函数
@option {Boolse} false 是否显示log
**/
compress.webp = function(source, target, quant, callback, haslog) {
   if(jdf.config.build.hasCmdLog) console.log( 'compress.webp---'+source);

    var webp = require('webp-converter');
    webp.cwebp(source, target, "-q " + quant ? quant : quant, function(status) {
        //if conversion successfull status will be '100' 
        //if conversion unsuccessfull status will be '101' 
        if (callback) {
            callback(status);
        }
    });

};

/**
@method 将 webp 相关css 追加到指定css中
@option {String} source 输入文件路径
**/
compress.appendWebpCSSFIX = function(source) {
    var AST_result = [];
    var sourceCode = compress.css(source, false);
    //remove comment
    sourceCode = sourceCode.replace(/\/\*.*?\*\//ig, function(match) {
        return ""
    });
    var rules = sourceCode.match(/.*?\{.*?\}/ig);
    if (!rules) {
        return;
    }
    for (var i = 0; i < rules.length; i++) {
        var rule = rules[i];
        if (rule.match(/\{/g).length != rule.match(/\}/g).length) {
            continue;
        }
        var cssBodyStr = rule.match(/\{.*?\}/ig)[0];
        var cssHead = rule.replace(cssBodyStr, "");
        cssHead = cssHead.split(';');
        cssHead = cssHead[cssHead.length - 1];
        cssBodyStr = cssBodyStr.replace('{', '').replace('}', '');
        var cssBodyProperties = cssBodyStr.split(';');
        var astCssRule = {};
        astCssRule.selector = cssHead;
        astCssRule.values = [];
        for (var j in cssBodyProperties) {
            var cssObj = cssBodyProperties[j].split(":");
            var cssPropertyName = cssObj[0];
            var cssPropertyValue = cssBodyProperties[j].replace(cssPropertyName + ":", "");
            if (cssPropertyValue.match(/.*?url.*?\.(png|jpg)/ig)) {
                var _c = {
                    k: cssPropertyName,
                    v: cssPropertyValue.replace(/.*?url.*?\.(png|jpg)/ig, function(match) {
                        return match + ".webp";
                    })
                };
                astCssRule.values.push(_c);
            }
        }
        if (astCssRule.values.length) {
            AST_result.push(astCssRule);
        }
    }

    var resultCss = ["/* webp css prefix */"];
    for (var i in AST_result) {
        var webpCssRule = AST_result[i];
        var rootClass = jdf.config.output.webpRootClass ? '.' + jdf.config.output.webpRootClass + " " : ".root-webp ";

        var cssValues = [];
        for (var j in webpCssRule.values) {
            var cssV = webpCssRule.values[j];
            cssValues.push(cssV.k + ":" + cssV.v);
        }
        var css = rootClass + webpCssRule.selector + "{" + cssValues.join(';') + "}";
        resultCss.push(css);
    }

    var raw = f.read(source);
    f.write(source, raw + "\n" + resultCss.join("\n"));


}
