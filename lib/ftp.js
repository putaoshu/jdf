/**
 * @ftp (upload files to remote server)
 * @time 2014-2-26 10:46:32
 */
var path = require('path');
var fs = require('fs');

//依赖lib
var f = require('./file.js');
var jdf = require('./jdf.js');

//exports
var ftp = module.exports;
var FTP = require('ftp');
//挂在ftp下面,供内部和外部调用
ftp.client = new FTP();
/**
* @取配置信息
* @config.json相关格式如下

    {
        "host":"192.168.1.1",
        "user":"*",
        "password":"*"
    }

*/
var options = {};
options.port = jdf.config.port || 21;
options.host = jdf.config.host || null;
options.user = jdf.config.user || null;
options.password = jdf.config.password || null;

//建立链接



/**
 * @当检测到ftp连接已开通,直接调用回调,否则放入 ready 事件中
 */
ftp.tryConnect = function() {
    var _promise = {};
    _promise.done = function(cb) {
        _promise._done = cb;
        return _promise;
    };
    _promise.err = function(cb) {
        _promise._err = function(){
            ftp.client.end();
            cb();
        } 
        return _promise;
    };


    if (ftp.client.connected) {
        _promise._done();
    } else {
        ftp.client.on('ready', function(err) {
            _promise._done();
        }).on('error', function(err) {
            try{
                _promise._err(err);
            }catch(e){
                console.log('jdf error [ftp.tryConnect] ftp配置错误');
            }
        });
        ftp.client.connect(options);

    }
    return _promise;

}


/**
 * @上传文件夹/文件
 * @param {String} source 原始文件夹/文件路径
 * @param {String} target 远端机器目标文件夹/文件路径
 * @param {Boole} uncover false
 * @param {Boole} move false 移动
 * @example ftp.upload('../test','test', null, null, false, false, false, function(){});
 */

ftp.upload = function(source, target, include, exclude, uncover, move, logTag, callback) {
    //打开进程
    
    ftp.tryConnect().done(function() {
        ftp.uploadMain(source, target, include, exclude, uncover, move, logTag, callback);
    }).err(function(err) {
        console.log('jdf error [ftp.upload] - ' + err);

    });
}

/**
 * @上传递归函数
 */
//上传本地和服务器端计数
var uploadLocalNum = 0;
var uploadRemoteNum = 0;

ftp.uploadMain = function(source, target, include, exclude, uncover, move, logTag, callback) {
    var removedAll = true;
    var source = f.realpath(source);
    if (source) {
        var core = function() {
            if (f.isDir(source)) {
                if (!f.isBlankDir(source)) {
                    ftp.client.mkdir(target, false, function() {});
                    fs.readdirSync(source).forEach(function(name) {
                            if (name != '.' && name != '..' && !(/.svn/.test(name))) {
                                removedAll = ftp.uploadMain(source + '/' + name, target + '/' + name, include, exclude, uncover, move, logTag, callback) && removedAll;
                            }
                        });

                        if (move && removedAll) {
                            fs.rmdirSync(source);
                        }
                }
            } else if (f.isFile(source) && f.filter(source, include, exclude)) {
                uploadLocalNum += 1;
                 

                if (uncover /*&& f.exists(target)*/ ) {
                    //uncover
                    removedAll = false;
                } else {
                    ftp.put(source, target, function(err) {
                        uploadRemoteNum += 1;
                        if (uploadLocalNum == uploadRemoteNum) {
                            if (callback){
                                
                                callback(err);
                            } 
                            //关闭进程
                            ftp.client.end();
                        }

                    });

                    if (move) {
                        fs.unlinkSync(source);
                    }
                }
            } else {
                removedAll = false;
            }
        }
        core();
    } else {
        if (typeof(logTag) != 'undefined' && !logTag) {
            return;
        }
        console.log('[ ' + source + ' ] --- no such file or dir');
    }
    return removedAll;
}

/**
 * @put a file
 */
ftp.put = function(source, target, callback) {
    ftp.client.put(source, target, function(err) {
        if (err) {
            console.log('jdf error [ftp.put] - ' + target + ' - ' + err);
            if (callback) callback(err);
            ftp.client.end();
        } else {
            if (callback) callback();
        }
    });
}

/**
 * @get a file
 */
ftp.get = function(source, target, callback) {
    ftp.client.get(source, function(err, stream) {
        if (err) {
            console.log('jdf error [ftp.get] - ' + target + ' - ' + err);
            if (callback) callback(err);
            ftp.client.end();
        } else {
            stream.once('close', function() {
                // ftp.client.end(); 
            });
            stream.pipe(fs.createWriteStream(target));
            if (callback) callback();
        }
    });
}

/**
 * @download
 * @param {String} source 远端机器目标文件夹/文件路径
 * @param {String} target 本地文件夹/文件路径
 */
ftp.download = function(source, target, callback) {

    ftp.tryConnect().done(function() {
        ftp.downloadMain(source, target, callback);
    }).err(function(err) {

    });
}

/**
 * @downloadMain
 */
ftp.downloadMain = function(source, target, callback) {

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
                            ftp.client.end();
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

/**
 * @get server files list
 */
ftp.list = function(source, callback) {
    if (typeof(source) == 'undefined') {
        var source = './';
    }

    ftp.tryConnect().done(function() {
        ftp.listMain(source, callback);
    }).err(function(err) {

    });


}

/**
 * @get server files list main
 */
ftp.listMain = function(source, callback) {
    ftp.client.list(source, function(err, list) {
        if (err) {
            console.log('jdf error [ftp.list] - ' + err);
            ftp.client.end();
        } else {

            if (list && list.length > 0) {
                var filesList = [];
                list.forEach(function(data) {
                    var fileType = '';
                    if (data.type == '-') {
                        fileType = 'file';
                    } else if (data.type == 'd') {
                        fileType = 'dir';
                    }

                    filesList.push({
                        name: data.name,
                        type: fileType
                    })
                })
                if (callback) callback(filesList);
                //ftp.client.end();
                //console.log("end at 274");
            } else {
                if (callback) {
                    callback('error');
                } else {
                    console.log('jdf warnning : "' + source + '" is not exists');
                };
                //ftp.client.end();
                //console.log("end at 282");
            }

            if (!callback) {
                //ftp.client.end();
                //console.log("end at 287");
            }
        }
    });
}

/**
 * @get server files list
 */
ftp.mkdir = function(source, callback) {
    if (typeof(source) == 'undefined') {
        console.log('jdf error [ftp.mkdir] source is not exists');
        return;
    }

    ftp.tryConnect().done(function() {
        ftp.client.mkdir(source, false, function(err) {
            if (callback) callback(err);
        });
    }).err(function(err) {

    });

}
