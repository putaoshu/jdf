/**
 * @公用方法
 */
var path = require('path');
var fs = require('fs');
var util = require('util');
var crypto = require('crypto');

var $ = module.exports = {
    reg: {
        widget: function() {
            //检测是否存在和取widget name
            return new RegExp('{%widget\\s.*?name="(.*?)".*?%}', 'gm');
        },
        widgetType: function() {
            //取widget type
            return new RegExp('{%widget\\s.*?type="(.*?)".*?%}', 'gm');
        },
        widgetData: function() {
            //取widget data
            return new RegExp('{%widget\\s.*?data=\'(.*?)\'.*?%}', 'gm');
        },
        widgetComment: function() {
            //取widget 是否有注释
            return new RegExp('{%widget\\s.*?comment=[\'|"](.*?)[\'|"].*?%}', 'gm');
        },
        widgetPosition: function() {
            //取widget position
            return new RegExp('{%widget\\s.*?position="(.*?)".*?%}', 'gm');
        },
        widgetOutputName: function() {
            //当前页面输出的widget name
            return new RegExp('{%widgetOutputName="(.*?)".*?%}', 'gm');
        },
        commentWidget: function() {
            //匹配注释的widget
            return new RegExp('<!--\\s*{%widget\\s.*?name="(.*?)".*?%}\\s*-->', 'gm');
        },
        notCommentWidget: function() {
            //匹配非注释的widget
            return new RegExp('^(<!--){0}[.\\n\\t\\r\\s]*{%widget\\s.*?name="(.*?)".*?%}[.\\n\\r\\t\\s]*(-->){0}$', 'gm');
        },
        cssStr: '<link\\s.*?stylesheet\\s*.*href="(.*?)".*?>',
        cssLink: function() {
            return new RegExp(this.cssStr, 'gm');
        },
        jsStr: '<script\\s.*?src="(.*?)".*?</script>',
        jsLink: function() {
            return new RegExp(this.jsStr, 'gm');
        },
        staticPre: function() {
            return new RegExp('.*?static', 'gm');
        },
        htmlComment: function() {
            return new RegExp('<!--[\\S\\s]*?-->', 'g');
        }
    },
    placeholder: {
        csscomboLink: function(url) {
            return '<link type="text/css" rel="stylesheet"  href="' + url + '" source="combo"/>\r\n';
        },
        cssLink: function(url) {
            return '<link type="text/css" rel="stylesheet"  href="' + url + '" source="widget"/>\r\n';
        },
        jscomboLink: function(url) {
            return '<script type="text/javascript" src="' + url + '" source="widget"></script>\r\n';
        },
        jsLink: function(url) {
            return '<script type="text/javascript" src="' + url + '" source="widget"></script>\r\n';
        },
        insertHead: function(content, str) {
            //innsertBefore </head>
            if (/<\/head>/.test(content)) {
                return content.replace('</head>', str + '</head>');
            //innsertBefore <body>    
            } else if(/<body/.test(content)){
                return content.replace('<body', str + '<body');
            } else {
                return str + content;
            }
        },
        insertBody: function(content, str) {
            if (/<\/body>/.test(content)) {
                return content.replace('</body>', str + '</body>');
            } else {
                return content + str;
            }
        }
    },
    is: {
        //数据源文件
        dataSourceSuffix: '.json',
        dataSource: function(pathName) {
            return path.extname(pathName) === this.dataSourceSuffix;
        },
        tplSuffix: '.tpl',
        tpl: function(pathName) {
            return path.extname(pathName) === this.tplSuffix;
        },
        vmSuffix: '.vm',
        vm: function(pathName) {
            return path.extname(pathName) === this.vmSuffix;
        },
        smartySuffix: '.smarty',
        smarty: function(pathName) {
            return path.extname(pathName) === this.smartySuffix;
        },
        html: function(pathName) {
            return path.extname(pathName) === '.html';
        },
        cssSuffix: '.css',
        css: function(pathName) {
            return path.extname(pathName) === this.cssSuffix;
        },
        less: function(pathName) {
            return path.extname(pathName) === '.less';
        },
        //这个扩展名比较悲剧
        sass: function(pathName) {
            return path.extname(pathName) === '.scss';
        },
        jsSuffix: '.js',
        js: function(pathName) {
            return path.extname(pathName) === this.jsSuffix;
        },
        jpg: function(pathName) {
            return path.extname(pathName) === '.jpg';
        },
        png: function(pathName) {
            return path.extname(pathName) === '.png';
        },
        //图片文件
        img: function(pathName) {
            var name = path.extname(pathName);
            return name === '.jpg' || name === '.jpeg' || name === '.png' || name === '.gif';
        },
        //含有http,https
        httpLink: function(str) {
            return /^http:\/\/|https:\/\/|\/\/|^\/\//.test(str);
        },
        //是否为图片url
        imageFile: function(str) {
            var reg = new RegExp('.' + '(' + $.imageFileType() + ')');
            return reg.test(str);
        },
        babel: function(pathName) {
            return path.extname(pathName) === '.babel';
        }
    },
    /**
     * @过滤的文件名，不参与copy、deploy、output
     */
    excludeFiles: function(){
        return '\\.svn|Thumbs\\.db|\\.DS_Store|\\.git|\\.eslintrc|\\.gitignore|npm-debug\\.log|\\.npmignore|\\.vm|\\.smarty|\\.tpl|\\.scss|\\.less|\\.psd';
    },
    imageFileType: function() {
        return 'svg|tiff|wbmp|png|bmp|fax|gif|ico|jfif|jpe|jpeg|jpg|cur|eot|ttf|woff';
    },
    /**
     * @去掉path中的//
     */
    replaceSlash: function(path) {
        return path.replace(/\/\//gm, '/');
    },
    /**
     * @去空格
     */
    trim: function(str) {
        return str.replace(/\s/g, '');
    },
    /**
     * @变量存在返回变量,变量不存在返回''
     */
    getVar: function(t) {
        if (typeof(t) != 'undefined') {
            return t;
        }
        return '';
    }
}

/**
 * @取当前时间 2014-01-14 
 * @return 2014-01-14
 */
$.getDay = function(separator) {
    if (typeof(separator) == 'undefined') {
        separator = '-';
    }
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    var day = myDate.getDate();
    day = day < 10 ? '0' + day : day;
    return year + separator + month + separator + day;
}

/**
 * @取当前时间 12:11:10 
 * @return 14:44:55
 */
$.getTime = function(separator, hasMs) {
    if (typeof(separator) == 'undefined') {
        separator = ':';
    }
    var myDate = new Date();
    var hour = myDate.getHours();
    hour = hour < 10 ? '0' + hour : hour;
    var mint = myDate.getMinutes();
    mint = mint < 10 ? '0' + mint : mint;
    var seconds = myDate.getSeconds();
    seconds = seconds < 10 ? '0' + seconds : seconds;
    var ms = myDate.getMilliseconds();
    var result = hour + separator + mint + separator + seconds;
    if (typeof(hasMs) != 'undeinfed' && hasMs) {
        result += separator + ms;
    }
    return result;
}

/**
 * @取当前时间戳
 * @return 1439361919265
 */
$.getTimestamp = function() {
    return new Date().getTime();
}

/**
 * @name $.isArray
 * @param {All} obj 主体
 * @return {Boolean} true/false
 */
$.isArray = function(obj) {
    return Object.prototype.toString.apply(obj) === '[object Array]';
}

/**
 * @less/sass文件名称转css后缀
 * @time 2014-3-5
 * @example  a.less ==> a.css; a.sass ==> a.css
 */
$.getCssExtname = function(filename) {
    return filename.replace(/(scss|less)$/g, 'css');
}

$.getJsExtname = function(filename) {
    return filename.replace(/babel$/, 'js');
}

/**
 * @getUrlParam
 * @time 2014-10-8
 */
$.getUrlParam = function(url) {
    var urlParseRE = /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/;
    return urlParseRE.exec(url);
}

/**
 * @http get
 * @param {String} url 域名
 * @param {Function} callback 回调
 * @example 
	$.httpget('http://www.baidu.com/?tn=sitehao123', function (data){
		console.log(data);
	});
 */
$.httpget = function(url, callback) {
    var http = require('http');

    var matches = $.getUrlParam(url);
    var host = matches[6];
    var param = (matches[13] ? matches[13] : '') + (matches[16] ? matches[16] : '') + (matches[17] ? matches[17] : '');

    if (typeof(callback) == 'undefined') {
        var callback = null;
    }

    var options = {
        host: host,
        path: param,
        callback: callback
    };

    var requestCallback = function(response) {
        var str = '';

        response.on('data', function(chunk) {
            str += chunk;
        });

        response.on('end', function() {
            if (options.callback) options.callback(str);
        });
    }

    var req = http.request(options, requestCallback);
    req.on('error', function(e) {
        //console.log(e);
    });
    req.end();

    req.setTimeout(500, function() {
        req.abort();
    });
}

/**
 * @数组去重
 * @算法: 设置成一个对象的属性
 */
$.uniq = function(arr) {
    if ($.isArray(arr)) {
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
            obj[arr[i]] = i;
        }
        arr = [];
        var j = 0;
        for (var i in obj) {
            arr[j] = i;
            j += 1;
        }
    }
    return arr;
}

/**
 * @对象merage
 * @obj2的权重大
 */
$.merageObj = function(obj1, obj2) {
    for (var p in obj2) {
        try {
            if (obj2[p].constructor == Object) {
                obj1[p] = $.merageObj(obj1[p], obj2[p]);
            } else {
                obj1[p] = obj2[p];
            }
        } catch (e) {
            obj1[p] = obj2[p];
        }
    }
    return obj1;
}

/**
 * @inArray
 * @param {Array} arr 主体
 * @param {String} str字符串
 * @param {Boolean} include是否和匹配的字符串完全相同或者是包含的关系
 */
$.inArray = function(arr, str, include) {
    if (util.isArray(arr)) {
        var res = false;
        arr.forEach(function(item) {
            if (typeof(include) != 'undefined' && include) {
                var reg = new RegExp(str, 'gm')
                if (reg.test(item)) {
                    res = true;
                }
            } else {
                if (item == str) {
                    res = true;
                }
            }
        });
        return res;
    }
}

/**
 * @md5
 * @param {String} str 字符串
 */
$.md5 = function(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

/**
 * @arrayMax
 * @param {Array} arr 传入的数组 
 */
$.arrayMax = function(arr) {
    if (util.isArray(arr)) {
        var arrTemp=arr[0];
        for (var i=0; i<arr.length; i++){
            if(arr[i]>arrTemp){
                arrTemp = arr[i];
            }
        }
        return arrTemp;
    }
}
