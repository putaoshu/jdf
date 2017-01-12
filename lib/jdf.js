/**
 * @jdf
 */
var path = require('path');
var util = require('util');

//lib自身组件
var $ = require('./base.js');
var f = require('./file.js');

var Config = require("./config.js");
var Log = require("./log.js");

//define
var jdf = module.exports;

/**
 * @配置项
 */
jdf.config = Config;

/**
 * @commoder help --> old
 */
jdf.help = function() {
    var content = [];
    content = content.concat([
        '',
        '  Usage: jdf <Command>',
        '',
        '  Command:',
        '',
        '    install      install init dir, demo',
        //'  init         project directory init',
        '    build        build project',
        '      -open      auto open html/index.html',
        '      -combo     combo debug for online/RD debug',
        //'      -css       compile less/scss file in current dir',
        // '      -plain     output project with plain',
        '',
        //'    release      release project',
        '',
        '    output       output css/js/widget',
        //'      -html      output css/js/widget/html',
        '      -debug     uncompressed js,css,images for test',        
        '      dirname    output your own custom dirname',                
        //'      -rjs      output project based requirejs',
        //'      -backup    backup outputdir to tags dir',
        //'      -path [p]  replace projectPath to specified path option',
        '',
        '    upload       upload css/js/widget dir to "serverDir"',
        //'      -html      upload css/js/widget/html dir to "serverDir"',
        '      -debug     uncompressed js,css,images for test',
        '      dirname    upload output your own custom dirname',     
        '      -custom    upload a dir/file to server',
        '      -preview   upload html dir to remote "previewServerDir"',        
        '      -nc        upload css/js dir to preview server dir use newcdn url',
        '      -nh        upload html dir to preview server dir use newcdn url',
        //'      -list      upload file list from config.json to server',
        '',
        '    widget',
        '      -all       preview all widget',
        '      -list      get widget list from server',
        '      -preview xxx  preview a widget',
        '      -install xxx  install a widget to local',
        '      -publish xxx  publish a widget to server',
        '      -create xxx   create a widget to local',
        //'    -w    watch upload output files to remote sever',
        '',
        '    server       debug for online/RD debug',
        '    lint         file lint',
        '    format       file formater',
        ' ',
        '  Extra commands:',
        '',
        '    compress     compress js/css (jdf compress input output)',
        '    clean        clean cache folder',
        '    -h           get help information',
        '    -v           get the version number',
        ''
    ]);
    console.log(content.join('\n'));
}



/**
 * @总的初始化函数 from ../index.js
 * @commander
 */
jdf.init = function(argv) {
    //设置全局时间戳
    jdf.config.suffix = $.getTimestamp();

    //读取配置文件
    jdf.getConfig(function(configData) {
        var cmd2 = argv[2];
        jdf.currentDir = f.currentDir();

        if (argv.length < 3 || cmd2 === '-h' || cmd2 === '--help') {
            Log.send('help');
            jdf.help();

        } else if (cmd2 === '-v' || cmd2 === '--version') {
            Log.send('version');
            console.log(jdf.version());

        } else if (cmd2[0] === '-') {
            Log.send('help');
            jdf.help();

        } else if (cmd2 === 'b' || cmd2 === 'build') {
            Log.send('build');
            jdf.argvInit('build', argv);

        } else if (cmd2 === 'r' || cmd2 === 'release') {
            Log.send('release');
            jdf.argvInit('release', argv);

        } else if (cmd2 === 'o' || cmd2 === 'output') {
            Log.send('output');
            jdf.argvInit('output', argv);

        } else if (cmd2 === 'u' || cmd2 === 'upload') {
            var FtpUpload = require('./ftpUpload');
            Log.send('upload');
            FtpUpload.init(argv, configData);

        } else if (cmd2 === 'i' || cmd2 === 'install') {
            switch (argv[3]) {
                case 'demo':
                    Log.send('install-demo');
                    jdf.install('demo', argv[4]);
                    return;
                case 'init':
                    Log.send('install-init');
                    jdf.install('init', argv[4]);
                    return;
                default:
                    console.log('You can "jdf install demo or "jdf install init"');
            }

        } else if (cmd2 === 'c' || cmd2 === 'compress') {
            var Compress = require('./compress.js');
            Log.send('compress');
            Compress.dir(argv[3], argv[4]);

            //widget
        } else if (cmd2 === 'w' || cmd2 === 'widget') {
            var Widget = require("./widget.js");

            var cmd3 = argv[3],
                cmd4 = argv[4],
                cmd5 = argv[5];
            var force = cmd5 != 'undefined' && cmd5 == '-force' ? true : false

            if (cmd3 == '-all' || cmd3 == '-a') {
                Log.send('widget-all');
                Widget.all(cmd4);
            }

            if (cmd3 == '-list' || cmd3 == '-l') {
                Log.send('widget-list');
                Widget.list(cmd4);
            }

            var hasCmd4 = function() {
                if (cmd4) {
                    return true;
                } else {
                    console.log('jdf tips [jdf.init] Please input widget name');
                    return false;
                }
            }

            var widgetCmd = function() {
                var content = [];
                content = content.concat([
                    '',
                    '  Command:',
                    '',
                    '    widget',
                    '      -all     preview all widget',
                    '      -list    get widget list from server',
                    '      -preview xxx     preview a widget',
                    '      -install xxx     install a widget to local',
                    '      -publish xxx     publish a widget to server',
                    '      -create  xxx     create a widget to local',
                    ''
                ]);
                console.log(content.join('\n'));
            }

            if (cmd3) {
                if (cmd3 == '-preview' || cmd3 == '-pre' && hasCmd4()) {
                    Log.send('widget-preview');
                    Widget.preview(cmd4);

                } else if (cmd3 == '-install' || cmd3 == '-i' && hasCmd4()) {
                    Log.send('widget-install');
                    Widget.install(cmd4, force);

                } else if (cmd3 == '-publish' || cmd3 == '-p' && hasCmd4()) {
                    Log.send('widget-publish');
                    Widget.publish(cmd4, force);

                } else if ((cmd3 == '-create' || cmd3 == '-c') && hasCmd4()) {
                    Log.send('widget-create');
                    Widget.create(cmd4);

                }
            }

            if (!cmd3) {
                widgetCmd();
            }

            //extra commands
            //server
        } else if (cmd2 === 'server') {
            Log.send('server');
            jdf.server(f.currentDir())

            //file lint
        } else if (cmd2 === 'lint' || cmd2 === 'l') {
            var cmd3 = argv[3];
            var filename = (typeof(cmd3) == 'undefined') ? f.currentDir() : cmd3;
            Log.send('file lint');
            var FileLint = require('./fileLint');
            FileLint.init(filename);

            //file format
        } else if (cmd2 === 'format' || cmd2 === 'f') {
            var cmd3 = argv[3];
            var filename = (typeof(cmd3) == 'undefined') ? f.currentDir() : cmd3;
            Log.send('file format');
            var FileFormat = require('./fileFormat');
            FileFormat.init(filename);

            //clean 
        } else if (cmd2 === 'clean') {
            Log.send('clean');
            jdf.clean();

            //todo: beautiful/jsbin/
        } else {
            console.log('jdf error [jdf.init] invalid option: ' + cmd2 + ' \rType "jdf -h" for usage.');
        }
    });
};

/**
 * @输入命令的初始化 build, release, output
 */
jdf.argvInit = function(runType, argv, callback) {
    if (runType == 'build' || runType == 'release') {
        if (runType == 'build' && typeof(argv[3]) != 'undefined' && argv[3] == '-css') {
            jdf.buildCss();
        } else {
            var autoOpenurl = false,
                comboDebug = false;
            if (typeof(argv[3]) != 'undefined') {
                if (argv[3] == '-open' || argv[3] == '-o') autoOpenurl = true;
                if (argv[3] == '-combo' || argv[3] == '-c') comboDebug = true;
            }

            jdf.bgMkdir();
            jdf.bgCopyDir();
            jdf.buildMain(runType, argv[3] || argv[4]);

            //plain mode
            if(argv[3] == '-plain' || argv[4] == '-plain'){
                var outputdirName = jdf.config.outputDirName;
                var outputdir = outputdirName+'/'+jdf.getProjectPath();
                f.copy(jdf.bgCurrentDir, outputdir);

                console.log('jdf build plain success!');
            }else{
                console.log("at precess:<<"+process.pid+">>");

                jdf.server(jdf.bgCurrentDir, autoOpenurl, comboDebug, function(data) {
                    jdf.watch(runType, callback, data);
                });
            }
        }
    } else if (runType == 'output') {
        // jdf.bgMkdir();
        // var _bgdir=jdf.bgCurrentDir+"_"+Math.random();
        // f.renameFile(jdf.bgCurrentDir,_bgdir);
        // console.log(_bgdir);
        // f.delAsync(_bgdir);
        // f.mkdir(jdf.bgCurrentDir);
        
        jdf.bgMkdir();
        f.del(jdf.bgCurrentDir, function() {
            jdf.bgCopyDir();
            jdf.buildMain(runType);
            //默认
            var outputType = 'default',
                projectPath = null,
                outputList, isbackup = false,
                isdebug = false;

            if (typeof(argv[3]) != 'undefined') {
                var cmd3 = argv[3];
                var cmd4 = argv[4];

                //custom自定义
                outputType = 'custom';
                outputList = cmd3;

                //projectPath自定义
                if (cmd3 == '-path') {
                    projectPath = cmd4;
                    outputType = 'default';
                }

                //debug(不压缩)
                if (cmd3 == '-debug' || cmd4 == '-debug') {
                    isdebug = true;
                    if (!cmd4) outputType = 'default';

                    //按配置项来输出
                    if (jdf.config.outputCustom) {
                        outputType = 'custom';
                        outputList = jdf.config.outputCustom;
                    }
                }

                //hashtml
                //if (cmd3 == '-html' || cmd4 == '-html'||cmd3 == '-h' || cmd4 == '-h') {
                //    outputType = 'hashtml';
                //    outputList = null;
                //}

                //backup
                if (cmd3 == '-backup' || cmd4 == '-backup') {
                    outputType = 'backup';
                    isbackup = true;
                    if (cmd4 == '-backup') {
                        outputType = 'custom';
                        outputList = cmd3;
                    }
                }

                //r.js
                if(cmd3 == '-rjs' || cmd4 == '-rjs'){
                    outputType = 'default';
                    jdf.config.output.rjs = true;
                }

            } else {
                //按配置项来输出
                if (jdf.config.outputCustom) {
                    outputType = 'custom';
                    outputList = jdf.config.outputCustom;
                }
            }

            var Output = require("./output.js");

            try {
                Output.init({
                    type: outputType,
                    list: outputList,
                    projectPath: projectPath,
                    isbackup: isbackup,
                    isdebug: isdebug,
                    callback: callback
                });
            } catch (e) {
                console.log(e);
            }

        });
    }
}

/**
 * @读取jdf version
 */
jdf.version = function() {
    var package = require('../package.json');
    return package.version;
}

/**
 * @读取配置文件config.json, 覆盖默认配置
 */
jdf.getConfig = function(callback) {
    var res = null;
    var url = f.currentDir() + '/' + jdf.config.configFileName;
    if (f.exists(url)) {
        try {
            var data = f.read(url);
            if (data) {
                data = JSON.parse(data);
                if (typeof(data) == 'object') {
                    data = $.merageObj(jdf.config, data);
                }
                //console.log(data);
                res = data;
            }
            if (callback) callback(res);
        } catch (e) {
            console.log('jdf error [jdf.getConfig] - config.json format error');
            console.log(e);
            if (callback) callback(res);
        }
    } else {
        if (callback) callback(res);
    }
}

/**
 * @工程后台文件夹生成
 * @jdf.bgCurrentDir 为后台文件根目录
 */
jdf.bgMkdir = function() {
    var list = ['LOCALAPPDATA', 'HOME', 'APPDATA'];
    var temp;
    for (var i = 0, len = list.length; i < len; i++) {
        if (temp = process.env[list[i]]) {
            break;
        }
    }
    if (temp) {
        temp = temp || __dirname + '/../';
        temp += '/.jdf-temp/';
        temp = path.normalize(temp);
        f.mkdir(temp);

        //创建文件夹
        var creatDir = function(filename) {
            var dir = path.normalize(temp + '/' + filename + '/');
            f.mkdir(dir);
            jdf[filename + 'Dir'] = dir;
        };

        //项目缓存文件夹
        creatDir('cache');
        //项目temp文件夹
        creatDir('temp');
        //项目lib文件夹
        //todo:自动从服务器下载最新版的jdj和jdm,现在是需要install手动下载
        creatDir('lib');
        //creatDir('jdj');
        //creatDir('jdm');

        creatDir('backup');

        //复制当前项目至temp文件夹(除outputdir)
        //取得当前工程名
        var currentDirName = path.basename(jdf.currentDir);
        jdf.bgCurrentDir = path.normalize(jdf.tempDir + '/' + currentDirName);

        jdf.bgCurrentDirName = currentDirName;
        f.mkdir(jdf.bgCurrentDir);
    }
}
/**
 * @复制当前项目至工程后台目录
 * @仅copy app,html,widget, config文件
 */
jdf.bgCopyDir = function() {
    var excludeFiles = $.excludeFiles();

    if(jdf.config.build.excludeFiles){
        excludeFiles += '|' + jdf.config.build.excludeFiles;
    }

    excludeFiles = excludeFiles.replace('||','|')

    if (jdf.config.baseDir != '' || jdf.config.outputCustom) {
        f.copy(jdf.currentDir + '/' + jdf.config.baseDir, jdf.bgCurrentDir + '/' + jdf.config.baseDir, null, excludeFiles);
    }else{
        f.copy(jdf.currentDir + '/' + jdf.config.cssDir, jdf.bgCurrentDir + '/' + jdf.config.cssDir, null, excludeFiles);
        f.copy(jdf.currentDir + '/' + jdf.config.imagesDir, jdf.bgCurrentDir + '/' + jdf.config.imagesDir, null, excludeFiles);
        f.copy(jdf.currentDir + '/' + jdf.config.jsDir, jdf.bgCurrentDir + '/' + jdf.config.jsDir, null, excludeFiles);
        f.copy(jdf.currentDir + '/' + jdf.config.htmlDir, jdf.bgCurrentDir + '/' + jdf.config.htmlDir, null, excludeFiles);
        f.copy(jdf.currentDir + '/' + jdf.config.widgetDir, jdf.bgCurrentDir + '/' + jdf.config.widgetDir, null, excludeFiles);
        f.copy(jdf.currentDir + '/' + jdf.config.configFileName, jdf.bgCurrentDir + '/' + jdf.config.configFileName, null, excludeFiles);
    }
}

/**
 * @屏幕打点器
 * @time 2014-3-14 07:08
 * @example
 *  begin: jdf.dot.begin()  end: jdf.dot.end();
 */
jdf.dot = {
    timer: null,
    begin: function() {
        this.date = new Date();
        process.stdout.write('.');
        this.timer = setInterval(function() {
            process.stdout.write('.');
        }, 1000);
    },
    end: function(haslog) {
        var haslog = typeof(haslog) == 'undefined' ? true : haslog;
        if (this.timer) {
            var date = new Date();
            clearInterval(this.timer);
            if (haslog) {
                console.log('jdf spend ' + (date - this.date) / 1000 + 's');
            } else {
                console.log();
            }
        }
    }
}

/**
 * @从服务器端下载文件 todo:检查版本号
 */
jdf.download = function(pathItem, targetDir) {
    var url = jdf.config[pathItem];
    var cacheDir = path.normalize(jdf.cacheDir + '/' + pathItem + '.tar');

    console.log('jdf downloading');
    jdf.dot.begin();

    f.download(url, cacheDir, function(data) {
        if (data == 'ok') {
            f.tar(cacheDir, targetDir, function() {
                console.log('\r\njdf [' + pathItem + '] install done');
                jdf.dot.end(false);
            });
        } else if (data == 'error') {
            jdf.dot.end(false);
        }
    })
}

/**
 * @从服务器端下载jdj, jdm, demo 或其它文件
 */
jdf.install = function(type, dir) {
    jdf.bgMkdir();
    
    /**
    widget模块安装走jdf widget -install widget/header
    console.log('jdf downloading');
    jdf.download('jdj', jdf.libDir);
    jdf.download('jdm', jdf.libDir);
    */
    if (type == 'demo') {
        jdf.download('demo', jdf.currentDir, dir);
    } else if (type == 'init') {
        jdf.createStandardDir(dir);
    }
}

/**
* @getIp
*/
jdf.getIp = function(){
    var net = require('os').networkInterfaces();
    for(var key in net){
        if(net.hasOwnProperty(key)){
            var items = net[key];
            if(items && items.length){
                for(var i = 0; i < items.length; i++){
                    var ip = String(items[i].address).trim();
                    if(ip && /^\d+(?:\.\d+){3}$/.test(ip) && ip !== '127.0.0.1'){
                        return ip;
                    }
                }
            }
        }
    }
    return '127.0.0.1';
};

/**
* @扫描服务器的启始端口是否在运行
* @param {String}  host host
* @param {Number}  start 开始的端口号
* @param {Number}  end 结束的端口号
* @param {Function}  callback回调函数
*/
jdf.scan = function(host, start, end, callback) {
    var net = require('net');
    var count = end - start;
    var result = [];

    for (var i = start; i <= end; i++) {
        var item = net.connect({
                host: host,
                port: i
            },
            function(i) {
                return function() {
                    result.push(i);
                    this.destroy();
                };
            }(i)
        );
 
        item.on('error', function(err) {
            if (err.errno == 'ECONNREFUSED') {
                this.destroy();
            }
        });
 
        item.on('close', function() {
            if (!count--) {
                callback(result);
            }
        });
    }
}

/**
 * @取localServerPort
 */
jdf.getLocalServerPort = function(callback){
    var localServerPort = jdf.config.localServerPort;
    jdf.scan('localhost', localServerPort, localServerPort, function(result) {
        if(result.length){
            jdf.scan('localhost', 3000, 3050, function(result) {
                var r = result.length == 0 ? 3000 : $.arrayMax(result) + 1;
                callback(r);
            });
        }else{
            callback(localServerPort);
        }
    });
}

/**
* @服务器
* @param {Boolse}
* @param autoOpenurl true: html/index.html存在的话则打开, 不存在打开 http://localhost:3000/
* @param autoOpenurl false: 只启动不打开网页
* @param {Boolse}  comboDebug 联调/线上调试模式
*/
jdf.server = function(currentDir, autoOpenurl, comboDebug, callback) {
    var Server = require('./server.js');
    // var FindPort = require('./findPort');
    var Colors = require('colors');

    jdf.getLocalServerPort(function(localServerPort){
        if(jdf.config.build.hasBrowserSync){
            //use "browser-sync" server
            var bs = require("browser-sync").create();
            bs.watch("*.html").on("change", bs.reload);
            bs.init({
                server: currentDir
            });
            if (callback) callback(1);
        }else{
            var Compress = require('./compress.js');
            Server.init( currentDir, localServerPort, jdf.config.cdn, jdf.getProjectPath(), comboDebug, Compress.addJsDepends);
            
            if (typeof(autoOpenurl) != 'undefined' && autoOpenurl) {
                var homepage = '/' + jdf.config.htmlDir + '/index.html';
                if (!f.exists(jdf.currentDir + homepage)) {
                    homepage = '';
                }
                require("./openurl.js").open('http://localhost:' + localServerPort);
            }
            console.log('jdf server : running at '+ localServerPort);
            console.log(Colors.gray('----------------------------------------'));
            console.log('   Local: '+Colors.magenta('http://localhost:' + localServerPort + '/'));
            var externalIp = 'http://'+jdf.getIp()+':' + localServerPort + '/';
            console.log('External: '+Colors.magenta(externalIp));
            console.log(Colors.gray('----------------------------------------'));
                
            if(jdf.config.build.qrcode != false){
                require("qrcode-terminal").generate(externalIp, { small: true }, function(qrcode){
                    console.log(Colors.gray(qrcode));
                    console.log(Colors.gray('----------------------------------------'));
                });
            }

            console.log('Current files from: '+jdf.currentDir);
            console.log('Serving files from: '+currentDir);
            if (callback) callback(1);
        }
    });
}

/**
 * @检测路径是否为项目文件夹内路径 即 baseDir htmlDir widgetDir configFile
 * @param {String} filename 文件路径
 */
jdf.checkProjectDir = function(filename) {
    var dirname = filename.replace(jdf.currentDir, '');
    dirname = dirname.replace(/\\/, '');
    if (/^\//.test(dirname)) dirname = dirname.replace(/\//, '');

    var checkTag = false;
    var checkProjectDir = function(i, j) {
        var reg = new RegExp('^' + i);
        if (reg.test(j)) {
            return true;
        } else {
            return false;
        }
    }

    if (checkProjectDir(jdf.config.baseDir, dirname) || checkProjectDir(jdf.config.htmlDir, dirname) || checkProjectDir(jdf.config.widgetDir, dirname) || checkProjectDir(jdf.config.configFileName, dirname)) {
        checkTag = true;
    }
    return checkTag;
}

/**
 * @watch && Livereload
 * @复制有变动的文件
 */
jdf.watch = function(type, callback, data) {
    var Node_watch = require('node-watch');
    var Livereload = require('./livereloadServer');

    if (!data) {
        //如果有另外一个进程那么livereload会直接关闭
        jdf.config.build.livereload = false;
        //console.log("another jdf process running , jdf livereload closed"); 
    }

    //livereload
    if (jdf.config.build.livereload) Livereload.init();

    var regStr = '\\.(vm|tpl|shtml|html|smarty|js|css|less|sass|scss|json|babel|' + $.imageFileType() + ')$';
    var reg = new RegExp(regStr);

    //todo初始化时前后台文件夹同步
    Node_watch(jdf.currentDir, function(filename) {
        //文件过滤
        if (f.isFile(filename)) {
            if (!reg.test(filename)) return;
        }

        var target = jdf.bgCurrentDir + filename.replace(jdf.currentDir, '');
        if (jdf.checkProjectDir(filename)) {
            if (f.exists(filename)) {
                f.copy(filename, target, regStr);
                //build
                jdf.buildMain(type);
                //livereload
                if (jdf.config.build.livereload) Livereload.reloadBrowser([target]);
                if (callback) callback(filename);
            } else {
                f.del(target, function() {
                    if (callback) callback(filename);
                });
            }
        }
    });

    if (callback) callback();
}

/**
 * @获取项目前缀名字
 * @仅从配置文件中取,不再支持branch/trunk 2014-5-24
 * @del --> 1. d:\product\index\trunk ===> product/index
 * @del --> 2. d:\product\index\branches\homebranches ===> product/index
 * @del --> 3. d:\product\index\homebranches ===> product
 */
jdf.getProjectPath = function() {
    var currentDir = f.currentDir(),
        result = '';
    if (jdf.config.projectPath != null) {
        result = jdf.config.projectPath;
    } else {
        result = path.basename(f.currentDir());
    }
    return result;
}

/**
 * @项目工程目录初始化
 * @time 2014-2-19 10:21:37
 */
jdf.createStandardDir = function(dir) {
    var dirArray = [];
    dirArray[0] = jdf.config.baseDir;
    dirArray[1] = jdf.config.cssDir;
    dirArray[2] = jdf.config.imagesDir;
    dirArray[3] = jdf.config.jsDir;
    dirArray[4] = jdf.config.htmlDir;
    dirArray[5] = jdf.config.widgetDir;

    if(dir){
        dir += '/';
    }else{
        dir = 'jdf_init/';
    }

    for (var i = 0; i < dirArray.length; i++) {
        f.mkdir(dir+dirArray[i]);
    }

    var fileArray = [];
    fileArray[0] = jdf.config.configFileName;
    fileArray[1] = jdf.config.htmlDir + '/index.html';

    var templateDir = path.resolve(__dirname, '../template/');

    for (var i = 0; i < fileArray.length; i++) {
        if (!f.exists(fileArray[i])) f.write(dir+'/'+fileArray[i], f.read(templateDir + '/' + fileArray[i]));
    }
    console.log('jdf project directory "'+dir.replace('/','')+'" init done!');
}

/**
 * @清除项目缓存文件夹
 */
jdf.clean = function() {
    jdf.bgMkdir();
    f.del(jdf.tempDir, function() {
        console.log('jdf cache dir clean done');
    });
}

/**
 * @在当前文件夹下编译less/sass
 */
jdf.buildCss = function() {
    var BuildCss = require("./buildCss.js");
    var Node_watch = require('node-watch');

    console.log('jdf buildCss ...');
    var currentDir = jdf.currentDir;
    BuildCss.init(currentDir, currentDir);

    var regStr = '\\.(less|sass|scss)$';
    var reg = new RegExp(regStr);

    Node_watch(currentDir, function(filename) {
        if (f.isFile(filename)) {
            if (!reg.test(filename)) return;
        }

        console.log(filename.replace(currentDir, ''));
        BuildCss.init(currentDir, currentDir);
    });
}

/**
 * @build html(widget), css(sass, less), js(es6)
 */
jdf.buildMain = function(type, param) {
    if(jdf.config.build.hasCmdLog) console.log('jdf build ...');
    //console.log('['+$.getTime(':', false)+'] build ...');
    var BuildWidget = require("./buildWidget.js");

    //build html (todo jdf.config.outputCustom)
    var buildHtmlDir = '/' + jdf.config.buildDirName + '/';
    var buildHtmlDirFull = jdf.currentDir + buildHtmlDir;
    if (f.exists(buildHtmlDirFull)) {
        if(jdf.config.build.hasCmdLog) console.log('jdf build html...');
        var encoding = jdf.config.output.encoding;
        var basedirlist = f.getdirlist(buildHtmlDirFull, '.html$');
        basedirlist.forEach(function(source) {
            var target = path.normalize(jdf.bgCurrentDir + buildHtmlDir + source.replace(buildHtmlDirFull, ''));
            BuildWidget.init(source, f.read(source), type, function(data) {
                if(f.excludeFiles(target)){
                    f.write(target, data.tpl, encoding);
                }
                return 'ok';
            }, param);
            //require('./buildByNunjucks').init(source);
        });
    }
    
    if(jdf.config.build.hasCmdLog) console.log('jdf build css ...');

    //build css
    var BuildCss = require("./buildCss.js");
    if(jdf.config.outputCustom){
        var list = jdf.config.outputCustom;
        var listArray = list.split(',');
        for (var i=0; i<listArray.length; i++ ){
            var item = listArray[i];
            if ( f.exists(item) ) {
                BuildCss.init(item, jdf.bgCurrentDir + '/' + item);
            }
        }
    }else{
        BuildCss.init(jdf.config.cssDir, jdf.bgCurrentDir + '/' + jdf.config.cssDir);
        BuildCss.init(jdf.config.widgetDir, jdf.bgCurrentDir + '/' + jdf.config.widgetDir);        
    }

    //build es6 js
    if(jdf.config.build.isEs6){
        if(jdf.config.build.hasCmdLog) console.log('jdf build js ...');

        if(jdf.config.build.es6Entry){
            //unify entrance
            var dist = type == "output" 
                ? jdf.currentDir+ '/'+jdf.config.outputDirName+'/'+jdf.getProjectPath() + '/' + jdf.config.jsDir 
                : jdf.bgCurrentDir + '/' + jdf.config.jsDir ;

            // use webpack && babel build es6
            var BuildByWebpack = require('./buildByWebpack.js');
            BuildByWebpack.init(
                jdf.currentDir + '/' , 
                jdf.config.build.es6Entry, 
                dist,
                type == "output"
            );
        }else{
            var BuildJs = require('./BuildJs.js');

            if(jdf.config.outputCustom) {
                var list = jdf.config.outputCustom;
                var listArray = list.split(',');
                for (var i=0; i<listArray.length; i++ ){
                    var item = listArray[i];
                    if ( f.exists(item) ) {
                        BuildJs.init(item, jdf.bgCurrentDir);
                    }
                }
            }else{
                BuildJs.init(jdf.config.jsDir, jdf.bgCurrentDir);
                BuildJs.init(jdf.config.widgetDir, jdf.bgCurrentDir);
            }
        }
    }
}
