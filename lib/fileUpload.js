/**
 * @upload by receiver
 * @ctime 2016-11-29
 */

var f = require('./file.js');
var jdf = require('./jdf.js');
var async = require('async');
var path = require('path');

var parseUrl = function(url, opt){
    opt = opt || {};
    url = require('url').parse(url);
    var ssl = url.protocol === 'https:';
    opt.host = opt.host
        || opt.hostname
        || ((ssl || url.protocol === 'http:') ? url.hostname : 'localhost');
    opt.port = opt.port || (url.port || (ssl ? 443 : 80));
    opt.path = opt.path || (url.pathname + (url.search ? url.search : ''));
    opt.method = opt.method || 'GET';
    opt.agent = opt.agent || false;
    return opt;
};

var map = function(obj, callback, merge){
    var index = 0;
    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            if(merge){
                callback[key] = obj[key];
            } else if(callback(key, obj[key], index++)) {
                break;
            }
        }
    }
};

var upload = function( opt, url, data, content, subpath, callback){
    if(typeof content === 'string'){
        content = new Buffer(content, 'utf8');
    } else if(!(content instanceof  Buffer)){
        console.log('unable to upload content [' + (typeof content) + ']');
    }
    data = data || {};
    var endl = '\r\n';
    var boundary = '-----np' + Math.random();
    var collect = [];
    map(data, function(key, value){
        collect.push('--' + boundary + endl);
        collect.push('Content-Disposition: form-data; name="' + key + '"' + endl);
        collect.push(endl);
        collect.push(value + endl);
    });
    collect.push('--' + boundary + endl);
    collect.push('Content-Disposition: form-data; name="file"; filename="' + subpath + '"' + endl);
    collect.push(endl);
    collect.push(content);
    collect.push('--' + boundary + '--' + endl);
    
    var length = 0;
    collect.forEach(function(ele){
        length += ele.length;
    });
    
    opt = opt || {};
    opt.method = opt.method || 'POST';
    opt.headers = {
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Length': length
    };
  
    opt = parseUrl(url, opt);
    var http = opt.protocol === 'https:' ? require('https') : require('http');
    
    var req = http.request(opt, function(res){
        var status = res.statusCode;
        var body = '';
        res
            .on('data', function(chunk){
                body += chunk;
            })
            .on('end', function(){
                if(status >= 200 && status < 300 || status === 304){
                    callback(null, body);
                } else {
                    callback(status);
                }
            })
            .on('error', function(err){
                callback(err.message || err);
            });
    });
    collect.forEach(function(d){
        req.write(d);
        if(d instanceof Buffer){
            req.write(endl);
        }
    });
    req.end();
};

var doTask = function (tasks, done) {
    var asyncTasks = [];
    tasks.forEach(function(task) {
        asyncTasks.push(function(cb) {
                upload(task.opt, task.url, task.data, task.content, task.subpath, function(n, data) {
                    if(jdf.config.build.hasCmdLog) console.log('upload---'+task.subpath + ', by '+data);
                    if(data==1){
                        console.log('jdf upload "'+task.subpath+'" error'
                            //' by '+ data+' !'
                        );
                    }else if(data==0){
                        // console.log('jdf upload success');
                    }

                    //https://github.com/caolan/async/issues/75
                    setTimeout(function() {
                        cb && cb();
                    }, 0);
                });
        });
    });

    async.parallelLimit(asyncTasks, 5, done);
};





/**
* @upload
* @time 2016-11-29
* @param {} source 本地文件夹
* @param {} target 远端机器文件夹
* @param {} host 远端机器机器ip/域名
* @param {} argv argv
* @param {Function} callback 回调函数
* @example
* 
*   jdf u (上传js/css/widget)
*   jdf u -h (上传js/css/widget/html)
*   
*   jdf u -custom ./dist (自定义上传dist文件夹)
*   
*/

exports = module.exports = function(source, target, host, argv, callbak){
    var tasks = [];

    source.forEach(function(sourceItem){
        var i = sourceItem.replace(jdf.currentDir+'/'+jdf.config.outputDirName,'');
        if(i.search("\\\\") != -1){
            i = sourceItem.replace(jdf.currentDir+'\\'+jdf.config.outputDirName,'');
        }

        //只取文件里面的文件
        if(argv[3] == '-custom' || argv[3] == '-c'){
            i = i.replace(argv[4], '')
        }

        // {
        //     opt:null,
        //     url:'http://xxx.com/receiver.php',
        //     data:{ to: '/xxx.com/build/index.html' },
        //     content:'index.html content',
        //     subpath:'/build/index.html'
        // }

        tasks.push({
            opt: null,
            url: 'http://'+host+'/receiver.php',
            data: { to: target+i },
            content: f.read(sourceItem, null),
            subpath: ('/'+i).replace('//','/')
        })
        // console.log({
        //     opt: null,
        //     url: 'http://'+host+'/receiver.php',
        //     data: { to: target+i },
        //     content: f.read(sourceItem, null),
        //     subpath: ('/'+i).replace('//','/')
        // });
    })
    // console.log(tasks);
    doTask(tasks, function(){
        if(callbak) callbak();
    });
}
