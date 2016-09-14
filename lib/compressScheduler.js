/**
 * Created by wangshaoxing on 2014/12/12.
 */

var path = require('path');
var fs = require('fs');
//lib自身组件
var $ = require('./base.js');
var f = require('./file.js');
var jdf = require('./jdf.js');




var cpus = require('os').cpus();

var CompressScheduler = module.exports = {};
CompressScheduler.isdebug = false;

//初始化任务池
var arr = [];
var initFilesArray = function(rSource, isdebug) {
    var isdebug = false || isdebug;
    var source = f.realpath(rSource);
    if (source) {
        if (f.isDir(source)) {
            fs.readdirSync(source).forEach(function(name) {
                if (name != '.' && name != '..' && !(/.svn/.test(name))) {
                    initFilesArray(source + '/' + name, isdebug);
                }
            });
        };
        if (f.isFile(source)) {
            arr.push(source);
        }
    }
}

//当任务池 被取空时，确保线程合并
var _execOnceFlag = 0;

CompressScheduler.init = function(outputdirName, isdebug, callBack) {
    initFilesArray(outputdirName);
    CompressScheduler.isdebug = isdebug;

    //webp wrapper 只在单线程下最稳定
    if (jdf.config.threads === 0 || (jdf.config.output && jdf.config.output.webp)) {
        var Compress = require('./compress.js');
        var task = arr.pop();
        while (task) {

            Compress.init(
                task,
                isdebug,
                jdf.config
            );
            task = arr.pop();
        }
        callBack();
    } else {
        //多进程
        var fork = require('child_process').fork;
        var childPath = __dirname + "/compressWorker.js";
        childPath = path.normalize(childPath);
        var threadCount = jdf.config.threads || cpus.length;
        for (var i = 0; i < threadCount; i++) {
            var subProc = fork(childPath);
            subProc.on('message', function(data) {
                var task = arr.pop();
                if (!task) {
                    this.disconnect();
                    _execOnceFlag++;
                    if (_execOnceFlag >= threadCount) {
                        callBack();
                    }
                    return;
                }
                this.send({
                    task: task,
                    isdebug: isdebug,
                    config: jdf.config,
                    getProject: jdf.getProject
                });
            });
        }
    }
}
