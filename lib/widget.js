/**
 * @本地widget预览和发布至外端机器
 */
var path = require('path');
var fs = require('fs');

//依赖lib
var $ = require('./base.js');
var f = require('./file.js');
var jdf = require('./jdf.js');
var Server = require('./server.js');
var Openurl = require("./openurl.js");
var FindPort = require('./findPort');

var Node_watch = require('node-watch');

//exports
var widget = module.exports;

/**
 * @widget path check
 */
widget.pathCheck = function(name) {
    if (typeof(name) == 'undefined') return true;

    /*
    if ( !/^widget\//.test(name) ) {
        console.log('jdf error widget name format error');
        return true;
    }*/

    if (!f.exists('widget/' + name)) {
        console.log('jdf error widget path is not exists');
        return true;
    }

    return false;
}

/**
 * @本地预览页面templete
 * @todo: 放在server上控制
 */
widget.templete = function(str, title) {
    if (typeof(str) == 'undefined' || !str) {
        var str = '';
    }

    var css = '';
    jdf.config.widget.css.forEach(function(item) {
        css += '<link rel="stylesheet" type="text/css" href="' + item + '" media="all" />\r\n';
    })

    var js = '';
    jdf.config.widget.js.forEach(function(item) {
        js += '<script type="text/javascript" src="' + item + '"></script>\r\n';
    })

    return '<!DOCTYPE html>' + '\r\n' +
        '<html>' + '\r\n' +
        '<head>' + '\r\n' +
        '<meta charset="utf-8" />' + '\r\n' +
        '<title>' + title + '</title>' + '\r\n' + css + js +
        '</head>' + '\r\n' +
        '<body>' + '\r\n' + str + '\r\n' +
        '</body>' + '\r\n' +
        '</html>';
}

/**
 * @path has "widget" 
 */
widget.hasWidget = function(path) {
    var reg = new RegExp(jdf.config.widgetDir, 'gm');
    return reg.test(path);
}

/**
 * @预览所有widget
 * @example  jdf widget -all
 * @本地所有的widget中tpl,css,js拼装后html文件放在html中
 */
widget.all = function() {
    jdf.bgMkdir();

    var htmlDir = jdf.config.htmlDir;
    f.mkdir(htmlDir);

    var target = htmlDir + '/allwidget.html';

    var widgetDir = f.currentDir() + '/' + jdf.config.widgetDir;
    if (!f.exists(widgetDir)) {
        console.log('jdf error widget not exists');
        return;
    }

    var core = function() {
        var widgetListHtml = '';
        fs.readdirSync(widgetDir).forEach(function(item) {
            if (f.excludeFiles(item)) {
                widgetListHtml += '{%widget name="' + item + '"%}\r\n';
            }
        });

        var result = widget.templete('\r\n' + widgetListHtml, jdf.getProjectPath() + ' - all widget preview');
        f.write(target, result);
    }

    core();
    jdf.argvInit('build', '-open', function() {
        //todo watch
        //core();
        Openurl.open('http://localhost:' + jdf.config.localServerPort + '/' + target);
        console.log('jdf open you broswer to see it');
    });
}

/**
 * @本地预览widget
 * @example  jdf widget -preview widget/header
 * @本地widget中tpl,css,js拼装后html文件放在当前widget中
 */
widget.preview = function(name) {
    jdf.bgMkdir();

    if (widget.pathCheck(name)) {
        return;
    }

    var target = 'widget/' + name;
    var widgetname = name;

    var core = function() {
        var result = widget.templete(null, widgetname);
        fs.readdirSync(target).forEach(function(item) {
            if (item && f.excludeFiles(item)) {
                var itemContent = f.read(target + '/' + item);

                if ($.is.tpl(item) || $.is.vm(item)) {
                    hasTpl = true;
                    itemContent = itemContent;
                    result = $.placeholder.insertBody(result, itemContent);
                }

                if ($.is.css(item)) {
                    result = $.placeholder.insertHead(result, $.placeholder.cssLink(item));
                }

                if ($.is.js(item)) {
                    result = $.placeholder.insertHead(result, $.placeholder.jsLink(item));
                }
            }
        });

        var indexUrl = target + '/' + widgetname + '.html';
        f.write(indexUrl, result);
    }

    core();

    var localServerPort = jdf.config.localServerPort;
    FindPort(localServerPort, function(data) {
        if (!data) {
            console.log('Port ' + localServerPort + ' is tack up');
            localServerPort += 1000;
            jdf.config.localServerPort = localServerPort;
        }

        Server.init(target + '/', jdf.config.localServerPort);
        Openurl.open('http://localhost:' + jdf.config.localServerPort + '/' + widgetname + '.html');
        console.log('jdf open you broswer to see it');

        //监听
        Node_watch(target, function(widgetname) {
            core();
        });
    });
}

/**
 * @下载widget到当前项目文件夹
 * @example  jdf widget -install widget/name
 * @time 2014-3-14 14:50:29
 */
widget.install = function(name, force) {
    var force = typeof(force) == 'undefined' ? false : force;
    var ftp = require('./ftp.js');

    ftp.tryConnect().done(function() {
        download(name, force);
    });

    function download(name, force) {

        var source = jdf.config.widgetServerDir + '/widget/' + name;
        var target = f.currentDir() + '/widget/' + name;
        var widgetname = name;

        ftp.listMain(source, function(data) {
            if (data != 'error') {
                var version = '';
                data.forEach(function(item) {
                    version = item.name;
                })

                if (!parseInt(version)) {
                    version = '';
                }

                var widgetNameVersion = widgetname + '/' + version;

                if (f.exists(target) && !force) {
                    ftp.client.end();
                    console.log('jdf warnning widget [' + widgetname + '] is exists in current project');
                } else {

                    downloadMain(source + '/' + version, target, function(data) {
                        if (data == 'error') {
                            console.log('jdf warnning widget [' + widgetNameVersion + '] is not exists on server ');
                        } else {
                            console.log('jdf widget [' + widgetNameVersion + '] install done from server ');
                        }
                        f.readJSON(target + '/component.json', function(data) {
                            for (name in data.dependencies) {
                                download(name, force);
                            }
                            ftp.client.end();
                        });
                    });
                }
            } else {
                console.log('jdf error [widget.install] ftp error!');
            }
        });
    }

    function downloadMain(source, target, callback, isEnd) {
        ftp.listMain(source, function(data) {
            if (data != 'error') {
                f.mkdir(target);
                var serverNum = 0,
                    localNum = 0;
                data.forEach(function(item) {
                    if (item.type == 'file') {
                        serverNum += 1;
                        var sourcePut = source + '/' + item.name;
                        var targetPut = target + '/' + item.name;

                        ftp.get(sourcePut, targetPut, function() {
                            localNum += 1;
                            if (serverNum == localNum) {
                                if (callback) callback();
                            }
                        });
                    }
                })
            } else {
                if (callback) callback(data);
            };
        });
    }

}

/**
 * @发布widget至server
 * @time 2014-3-14 14:50:29
 * @example  jdf widget -publish widget/name
 * @todo 增加name验证和版本控制
 */

widget.publish = function(name, force) {
    var publishDir = jdf.config.widgetServerDir + '/widget';

    var force = typeof(force) == 'undefined' ? false : force;
    if (widget.pathCheck(name)) {
        return;
    }

    var cUrl = 'widget/' + name + '/' + 'component.json';
    f.readJSON(cUrl, function(data) {
        if (data) {
            var cName = data.name;
            var cVersion = data.version;
            var ftp = require('./ftp.js');
            var target = publishDir + '/' + name + '/' + cVersion;
            ftp.mkdir(publishDir + '/' + name);

            ftp.list(target, function(data) {
                if (data == 'error' || force) {
                    ftp.mkdir(publishDir + '/' + name + '/');
                    ftp.mkdir(target);

                    ftp.uploadMain('widget/' + name, target, null, null, null, null, null, function(err) {
                        console.log('jdf widget "' + '' + name + '/' + cVersion + '" publish done!');
                    });
                } else {
                    console.log('jdf warnning "' + name + '/' + cVersion + '" is exists in server');
                }
            });
        }
    });
}

/**
 * @取得所有widget的列表
 * @time 2014-6-23 11:04:00
 */
widget.list = function() {
    var publishDir = jdf.config.widgetServerDir + '/widget';

    var ftp = require('./ftp.js');
    ftp.list(publishDir, function(data) {
        if (data) {
            console.log('jdf widget list: ');
            console.log('----------------');
            data.forEach(function(item) {
                console.log(item.name);
            })
        }
        ftp.client.end();
    })
}

/**
 * @根据关键字搜索所有widget
 * @time 2014-3-14 14:50:29
 */
widget.search = function(name) {

}


/**
 * @widget自动生成目录
 * @time 2014-6-23 11:04:00
 */
widget.create = function(name) {
    var widgetDir = 'widget/' + name;
    if (f.exists(widgetDir)) {
        console.log('jdf warnning : widget [' + name + '] is exists');
        return;
    }

    // 如果有配置createFiles，读配置项初始化widget目录
    if (jdf.config.widget.createFiles && jdf.config.widget.createFiles.length > 1) {
        var createFilesArr = [];

        jdf.config.widget.createFiles.forEach(function(item) {
            createFilesArr.push(name + '.' + item);
        })

        // console.log(createFilesArr);

        f.mkdir(widgetDir);

        createFilesArr.forEach(function(item) {
            f.write(widgetDir + '/' + item, '');
        });

        console.log('jdf widget [' + name + '] create done');

        return false;
    }

    console.log('jdf tips: if you create it, input "y" else input "n" ');
    var Prompt = require('simple-prompt');
    var questions = [{
        question: 'vm',
        required: true
    }, {
        question: 'js'
    }, {
        question: 'scss'
    }, {
        question: 'json'
    }];
    var profile = new Prompt(questions);
    profile.create().then(function(error, answers) {
        if (error) {
            return;
        }
        var createFilesArray = ['component.json'];
        if (answers.vm == 'y') createFilesArray.push(name + '.vm');
        if (answers.js == 'y') createFilesArray.push(name + '.js');
        if (answers.scss == 'y') createFilesArray.push(name + '.scss');
        if (answers.json == 'y') createFilesArray.push(name + '.json');

        f.mkdir(widgetDir);
        //jdf.config.widget.createFiles
        createFilesArray.forEach(function(item) {
            f.write(widgetDir + '/' + item, '');
        });

        //给compoent.json写入默认的内容
        var componentJson = '{\r\n' +
            '   "name": "' + name + '",\r\n' +
            '   "version": "1.0.0",\r\n' +
            '   "dependencies": {}\r\n' +
            '}';
        f.write(widgetDir + '/component.json', componentJson);

        console.log('jdf widget [' + name + '] create done');
    });
}
