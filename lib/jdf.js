/**
 * @jdf
 */
var path = require('path');
var util = require('util');
//lib自身组件
var $ = require('./base.js');
var f = require('./file.js');
var Server = require('./server.js');
var Compress = require('./compress.js');
var Openurl = require("./openurl.js");
var Config = require("./config.js");
var BuildCss = require("./buildCss.js");
var BuildWidget = require("./buildWidget.js");
var BuildES6 = require('./buildES6.js');
var BuildES6Js = require('./BuildES6Js.js');
var Output = require("./output.js");
var FindPort = require('./findPort');

var Log = require("./log.js");
var Widget = require("./widget.js");
var FtpUpload = require('./ftpUpload');
var FileLint = require('./fileLint');
var FileFormat = require('./fileFormat');
var program = require('commander');

// glob
var glob = require('glob');

//外部组件
var Node_watch = require('node-watch');
var Livereload = require('./livereloadServer');
var BuildByWebpack = require('./buildByWebpack')
var BuildByNunjucks = require('./buildByNunjucks')

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
        '      -css       compile less/scss file in current dir',
        '      -plain     output project with plain',
        '',
        '    release      release project',
        '',
        '    output       output project',
        '      -html      output project (include html)',
        '      -rjs      output project based requirejs',
        '      dirname    output your own custom dirname',
        '      -debug     uncompressed js,css,images for test',
        '      -backup    backup outputdir to tags dir',
        '      -path [p]  replace projectPath to specified path option',
        '',
        '    upload       upload css/js dir to remote sever',
        //'    -html      upload output project (include html)',
        '      dirname    upload output your own custom dirname',
        '      -debug     uncompressed js,css,images for test',
        '      -preview   upload html dir to preview server dir',
        '      -nc        upload css/js dir to preview server dir use newcdn url',
        '      -nh        upload html dir to preview server dir use newcdn url',
        '      -custom    upload a dir/file to server',
        '      -list      upload file list from config.json to server',
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
        jdf.currentDir = f.currentDir();

        if(configData.build && configData.build.isEs6){
            initDefaultWidgetEntry(configData);
        }

        initCommandWithArgs(argv, configData);
    });
};

/**
 * [initDefaultWidgetEntry 读取widget es6 入口文件]
 * @param  {[Object]} configData [config]
 */
function initDefaultWidgetEntry(configData){
    let entryList = {};
    let widgetEntryList = glob.sync(jdf.currentDir + '/widget/**/*.js');
    let name = '';
    let widgetNameArr = [];
    let widgetName = '';

    widgetEntryList.forEach(function(v){
        name = v.substr(v.indexOf('/widget')+1);
        name = name.substring(0,name.length-3);
        widgetNameArr = name.split('/');

        // 文件名和widget目录名称相等时，该文件才为入口文件
        if(widgetNameArr[1] === widgetNameArr[2]){
            entryList[name] = v;
        }
    });

    // 用户在config中配置的入口文件优先级高于默认规则

    entryList = Object.assign(entryList,configData.build.es6Entry);
    configData.build.es6Entry = entryList;
}

/**
 * 初始化install命令
 */
function initCommandWithArgs(argv, config) {
    program
        .version(jdf.version())
        .usage('[commands] [options]');

    // 所有命令入口初始化
    initInstall();
    initBuild();
    initOutput();
    initUpload(config);
    initWidget();

    initRelease();
    initCompress();
    initClean();
    initServer();
    initLint();
    initFormat();
    initUncaught();

    program.parse(argv);

    if (argv.length <= 2) {
        program.help();
    }
}

function initInstall() {
    program
        .command('install [projectName]')
        .alias('i')
        .description('create new project with template or not')
        .option('-t, --template [name]', 'specify template name (widget|empty) [empty]', 'empty')
        .action(function(projectName, options) {
            var type = options.template;
            projectName = projectName || (type == 'widget' ? 'jdf_widget' : 'jdf_init');
            switch(type) {
                case 'widget':
                    Log.send('install-demo');
                    jdf.install('widget', projectName);
                    break;
                case 'empty':
                    Log.send('install-init');
                    jdf.install('init', projectName);
                    break;
                default:
                    console.log('You can "jdf install projectPath or "jdf install -t widget projectPath"');
            }
        })
        .on('--help', function() {
            outputHelp([
                '$ jdf install myProj',
                '$ jdf install --template widget myProj'
            ]);
        });
}

function initBuild() {
    program
        .command('build')
        .alias('b')
        .description('build project')
        .option('-o, --open', 'auto open html/index.html')
        .option('-C, --combo', 'combo debug for online/RD debug')
        .option('-c, --css', 'compile less/scss file in current dir')
        .option('-p, --plain', 'output project with plain')
        .action(function(options) {
            Log.send('build');
            jdf.build(options);
        })
        .on('--help', function() {
            outputHelp([
                '$ jdf build',
                '$ jdf build --combo',
                '$ jdf build --open',
                '$ jdf build --css',
                '$ jdf build --plain'
            ])
        });
}

function initRelease() {
    program
        .command('release')
        .alias('r')
        .description('release project')
        .option('-o, --open', 'auto open html/index.html')
        .option('-C, --combo', 'combo debug for online/RD debug')
        .option('-p, --plain', 'release project with plain')
        .action(function(options) {
            Log.send('release');
            jdf.release(options);
        })
        .on('--help', function() {
            outputHelp([
                '$ jdf release',
                '$ jdf release --combo',
                '$ jdf release --open',
                '$ jdf release --plain'
            ]);
        });
}

function initOutput() {
    program
        .command('output [dir|file]')
        .alias('o')
        .description('output project')
        .option('-H, --html', 'output project (include html)')
        .option('-r, --rjs', 'output project based requirejs')
        .option('-d, --debug', 'uncompressed js,css,images for test')
        // .option('-b, --backup', 'backup outputdir to tags dir') // 暂时先去掉，有点bug，没怎么看懂这块代码
        .option('-p, --path <projectPath>', 'replace projectPath to specified path option')
        .action(function(dir, options) {
            Log.send('output');
            jdf.output(dir, options);
        })
        .on('--help', function() {
            outputHelp([
                '$ jdf output srcPath',
                '$ jdf output --debug --backup srcPath',
                '$ jdf output --path anotherName srcPath'
            ]);
        });
}

function initUpload(config) {
    program
        .command('upload [dir|file]')
        .alias('u')
        .description('upload css/js dir to remote sever')
        .option('-d, --debug', 'uncompressed js,css,images for test')
        .option('-p, --preview', 'upload html dir to preview server dir')
        .option('-C, --nc', 'upload css/js dir to preview server dir use newcdn url')
        .option('-H, --nh', 'upload html dir to preview server dir use newcdn url')
        .option('-c, --custom', 'upload a dir/file to server')
        .option('-f, --from [localPath]', 'when --custom used, --form must be supplied')
        .option('-t, --to [serverPath]', 'when --custom used, --to refer to remotePath')
        .option('-l, --list', 'upload file list from config.json to server')
        .action(function(dir, options) {
            Log.send('upload');
            FtpUpload.init(dir, options, config);
        })
        .on('--help', function() {
            outputHelp([
                '$ jdf upload',
                '$ jdf upload srcPath',
                '$ jdf upload --nc',
                '$ jdf upload --nh',
                '$ jdf upload --debug --preview srcPath'
            ]);
        });
}

function initWidget() {
    program
        .command('widget')
        .alias('w')
        .description('create/install/preview/publish widgets')
        .option('-a, --all', 'preview all local widgets')
        .option('-l, --list', 'get widget list from server')
        .option('-f, --force')
        .option('-p, --preview <widgetName>', 'preview a widget')
        .option('-i, --install <widgetName>', 'install a widget to local')
        .option('-P, --publish <widgetName>', 'publish a widget to server')
        .option('-c, --create <widgetName>', 'create a widget to local')
        .action(function(options) {
            options.force = options.force || false;
            if(options.all) {
                Log.send('widget-all');
                Widget.all();
            }

            if (options.list) {
                Log.send('widget-list');
                Widget.list();
            }

            if(options.preview) {
                Log.send('widget-preview');
                Widget.preview(options.preview);
            }

            if(options.install) {
                Log.send('widget-install');
                Widget.install(options.install, options.force);
            }

            if(options.publish) {
                Log.send('widget-publish');
                Widget.publish(options.publish, options.force);
            }

            if(options.create) {
                Log.send('widget-create');
                Widget.create(options.create);
            }
        })
        .on('--help', function() {
            outputHelp([
                '$ jdf widget --all',
                '$ jdf widget --list',
                '$ jdf widget --preview myWidget',
                '$ jdf widget --install ui-header --force',
                '$ jdf widget --publish myWidget',
                '$ jdf widget --create myWidget'
            ])
        });
}

function initCompress() {
    program
        .command('compress <srcPath> [destPath]')
        .alias('c')
        .description('compress js/css (jdf compress input output)')
        .action(function(srcPath, destPath) {
            Log.send('compress');
            Compress.dir(srcPath, destPath);
        })
        .on('--help', function() {
            outputHelp([
                '$ jdf compress ./js ./js-dest',
                '$ jdf compress ./css'
            ])
        });
}

function initClean() {
    program
        .command('clean')
        .description('clean cache folder')
        .action(function() {
            Log.send('clean');
            jdf.clean();
        })
        .on('--help', function() {
            outputHelp(['$ jdf clean']);
        });
}

function initServer() {
    program
        .command('server')
        .alias('s')
        .description('debug for online/RD debug')
        .action(function() {
            Log.send('server');
            Server.init('./', jdf.config.localServerPort, jdf.config.cdn, jdf.getProjectPath(), true);
            console.log('jdf server running at http://localhost:' + jdf.config.localServerPort + '/');
        })
        .on('--help', function() {
            outputHelp(['$ jdf server']);
        });
}

function initLint() {
    program
        .command('lint [dir|file]')
        .alias('l')
        .description('file lint')
        .action(function(dir) {
            var filename = (typeof(dir) == 'undefined') ? f.currentDir() : dir;
            Log.send('file lint');
            FileLint.init(filename);
        })
        .on('--help', function() {
            outputHelp([
                '$ jdf lint file.js',
                '$ jdf lint ./src'
            ]);
        });
}

function initFormat() {
    program
        .command('format [dir|file]')
        .alias('f')
        .description('file formater')
        .action(function(dir) {
            var filename = (typeof(dir) == 'undefined') ? f.currentDir() : dir;
            Log.send('file format');
            FileFormat.init(filename);
        })
        .on('--help', function() {
            outputHelp([
                '$ jdf format file.js',
                '$ jdf format ./src'
            ]);
        });
}

function initUncaught() {
    program
        .command('*')
        .action(function(env) {
            console.log('jdf error, invalid option: ' + env + '\nType "jdf -h" for usage.');
        });
}

function outputHelp(helpItems) {
    console.log('  Examples:');
    console.log('');
    helpItems.forEach(function(item) {
        console.log('    '+ item);
    })
    console.log();
}

jdf.build = function(options, callback) {
    if (options.css) {
        jdf.buildCss();
    } else {
        jdf.release(options, callback, 'build');
    }
}

jdf.release = function(options, callback, type) {
    type = type || 'release';
    var autoOpenurl = false,
        comboDebug = false;

    if (options.open) {
        autoOpenurl = true;
    }

    if (options.combo) {
        comboDebug = true;
    }

    jdf.bgMkdir();
    jdf.bgCopyDir();
    jdf.buildMain(type, options);

    //plain mode
    if(options.plain){
        var outputdirName = jdf.config.outputDirName;
        var outputdir = outputdirName+'/'+jdf.getProjectPath();
        f.copy(jdf.bgCurrentDir, outputdir);

        console.log('jdf build plain success!');
    }else{
        console.log('Version: jdf '+jdf.version());
        console.log("at precess:<<"+process.pid+">>");

        jdf.server(autoOpenurl, comboDebug, function(data) {
            jdf.watch(type, callback, data);
        });
    }
}

jdf.output = function(dir, options, callback) {
    jdf.bgMkdir();
    f.del(jdf.bgCurrentDir, function() {
        jdf.bgCopyDir();
        jdf.buildMain('output');
        //默认
        var outputType = 'default',
            projectPath = null,
            outputList,
            isbackup = false,
            isdebug = false;

        if (options.html || options.rjs || options.debug || options.backup || options.path) {
            //custom自定义
            outputType = 'custom';
            outputList = dir;

            //projectPath自定义
            if (options.path) {
                projectPath = options.path;
                outputType = 'default';
            }

            //debug(不压缩)
            if (options.debug) {
                isdebug = true;
                if (!dir) outputType = 'default';
            }

            //hashtml
            if (options.html) {
                outputType = 'hashtml';
                outputList = null;
            }

            //backup
            if (options.backup) {
                outputType = 'backup';
                isbackup = true;
                if (dir) {
                    outputType = 'custom';
                    outputList = dir;
                }
            }

            //r.js
            if(options.rjs){
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
    if (jdf.config.baseDir != '' || jdf.config.outputCustom) {
        f.copy(jdf.currentDir + '/' + jdf.config.baseDir, jdf.bgCurrentDir + '/' + jdf.config.baseDir);
    }

    f.copy(jdf.currentDir + '/' + jdf.config.cssDir, jdf.bgCurrentDir + '/' + jdf.config.cssDir);
    f.copy(jdf.currentDir + '/' + jdf.config.imagesDir, jdf.bgCurrentDir + '/' + jdf.config.imagesDir);
    f.copy(jdf.currentDir + '/' + jdf.config.jsDir, jdf.bgCurrentDir + '/' + jdf.config.jsDir);

    f.copy(jdf.currentDir + '/' + jdf.config.htmlDir, jdf.bgCurrentDir + '/' + jdf.config.htmlDir);
    f.copy(jdf.currentDir + '/' + jdf.config.widgetDir, jdf.bgCurrentDir + '/' + jdf.config.widgetDir);
    f.copy(jdf.currentDir + '/' + jdf.config.configFileName, jdf.bgCurrentDir + '/' + jdf.config.configFileName);

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
                console.log('\r\njdf spend ' + (date - this.date) / 1000 + 's');
            } else {
                console.log();
            }
        }
    }
}

/**
 * @从服务器端下载文件 todo:检查版本号
 */
jdf.download = function(pathItem, targetDir, targetName) {
    var url = jdf.config[pathItem];
    var cacheDir = path.normalize(jdf.cacheDir + '/' + pathItem + '.tar');

    console.log('jdf downloading');
    jdf.dot.begin();

    f.download(url, cacheDir, function(data) {
        if (data == 'ok') {
            f.tar(cacheDir, targetDir, function() {
                //强制改项目名同时修改config.json中的projectPath字段
                f.renameFile(path.resolve(targetDir, 'jdf_demo'), path.resolve(targetDir, targetName))
                var configFilePath = path.resolve(targetDir, targetName, 'config.json');
                f.readJSON(configFilePath, function(json) {
                    json.projectPath = targetName;
                    f.write(configFilePath, JSON.stringify(json, null, '\t'));
                    console.log('\njdf [' + targetName + '] install done');
                    jdf.dot.end(false);
                })
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
    if (type == 'widget') {
        jdf.download('demo', jdf.currentDir, dir);
    } else if (type == 'init') {
        jdf.createStandardDir(dir);
    }
}

/**
* @服务器
* @param {Boolse}
* @param autoOpenurl true: html/index.html存在的话则打开, 不存在打开 http://localhost:3000/
* @param autoOpenurl false: 只启动不打开网页
* @param {Boolse}  comboDebug 联调/线上调试模式
*/
jdf.server = function(autoOpenurl, comboDebug, callback) {
    var localServerPort = jdf.config.localServerPort;
    FindPort(localServerPort, function(data) {
        if (!data) {
            console.log('findPort : Port ' + localServerPort + ' has used');
            localServerPort = (localServerPort - 0) + 1000;
            jdf.config.localServerPort = localServerPort;
        }

        Server.init( jdf.bgCurrentDir, localServerPort, jdf.config.cdn, jdf.getProjectPath(), comboDebug, Compress.addJsDepends );

        if (typeof(autoOpenurl) != 'undefined' && autoOpenurl) {
            var homepage = '/' + jdf.config.htmlDir + '/index.html';
            if (!f.exists(jdf.currentDir + homepage)) {
                homepage = '';
            }
            jdf.openurl('http://localhost:' + localServerPort);
        }

        console.log('jdf server running at http://localhost:' + localServerPort + '/');
        if (callback) callback(data);
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
 * @openurl
 * @todo : 仅打开一次
 */
jdf.openurl = function(url) {
    if (typeof(url) == 'undefined') {
        var url = "http://localhost:3000/html/index.html";
    }
    Openurl.open(url);
}

/**
* @自动刷新
* @todo

    jdf.refresh = function(){

    }
*/

/**
 * @获取当前项目父级目录
 * @1. d:\product\index\trunk ===> d:\product/index
 * @2. d:\product\index\branches\homebranches ===> d:\product/index
 * @3. d:\product\index\homebranches ===> d:\product
 */
jdf.getProjectParentPath = function(currentDir) {
    var nowDir = '';
    if (/branches/.test(currentDir)) {
        nowDir = path.resolve(currentDir, '../', '../');
    } else if (/trunk/.test(currentDir)) {
        nowDir = path.resolve(currentDir, '../');
    }
    return nowDir;
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
        nowDir = '',
        result = '';
    if (jdf.config.projectPath != null) {
        result = jdf.config.projectPath;
    } else {
        //当前文件夹的文件夹命名为projectPath 2014-6-9
        result = path.basename(f.currentDir());
        /*
        nowDir = jdf.getProjectParentPath(currentDir);

        if (nowDir) {
            nowDir = nowDir.split(path.sep);
            var nowDirArrayLength = nowDir.length;
            result = nowDir[nowDirArrayLength-2] +'/'+ nowDir[nowDirArrayLength-1];
        }*/
    }
    return result;
}


/**
 * @当含有jdj jdm 模块时写放当前文件一次*/
// var writeJMOnce = false;


/**
 * @build widget, css(sass, less), js(es6)
 */
jdf.buildMain = function(type, param) {
    //console.log('['+$.getTime(':', false)+'] build ...');

    var builddir = '/' + jdf.config.buildDirName + '/';
    var basedir = jdf.currentDir + builddir;
    var encoding = jdf.config.output.encoding;

    //build css
    BuildCss.init(jdf.config.cssDir, jdf.bgCurrentDir + '/' + jdf.config.cssDir);
    BuildCss.init(jdf.config.widgetDir, jdf.bgCurrentDir + '/' + jdf.config.widgetDir);

    //build html
    if (f.exists(basedir)) {
        var basedirlist = f.getdirlist(basedir, '.html$');
        basedirlist.forEach(function(source) {
            var target = path.normalize(jdf.bgCurrentDir + builddir + source.replace(basedir, ''));
            BuildWidget.init(source, f.read(source), type, function(data) {
                if(f.excludeFiles(target)){
                    f.write(target, data.tpl, encoding);
                }

                // if (writeJMOnce) {
                //     f.write(source, data.origin, encoding);
                // }
                return 'ok';
            }, param);

            //BuildByNunjucks.init(source);
        });
    }

    //build es6
    if(!jdf.config.build.isEs6) return;

    if(jdf.config.build.es6Entry){
        var dist = type == "output"
            ? jdf.currentDir+ '/'+jdf.config.outputDirName+'/'+jdf.getProjectPath() + '/'
            : jdf.bgCurrentDir + '/';

        // use webpack && babel build es6
        BuildByWebpack.init(
            jdf.currentDir + '/',
            jdf.config.build.es6Entry,
            dist,
            type == "output"
        );
    }else{
        // build ES6 code(.babel files)
        BuildES6.init(jdf.config.jsDir, jdf.bgCurrentDir + '/' + jdf.config.jsDir);
        BuildES6.init(jdf.config.widgetDir, jdf.bgCurrentDir + '/' + jdf.config.widgetDir);

         // use babel build es6
        BuildES6Js.init(jdf.config.jsDir, jdf.bgCurrentDir);
        BuildES6Js.init(jdf.config.widgetDir, jdf.bgCurrentDir);
    }
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
    console.log('jdf project directory init done!');
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
 * @在当前文件下编译less/sass
 */
jdf.buildCss = function() {
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
