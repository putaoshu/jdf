var path = require('path');
var program = require('commander');
var jdf = require('./lib/jdf.js');
var Log = require("./lib/log.js");
var Compress = require('./lib/compress.js');
var Server = require('./lib/server.js');
var Widget = require("./lib/widget.js");
var FtpUpload = require('./lib/ftpUpload');
var FileLint = require('./lib/fileLint');
var FileFormat = require('./lib/fileFormat');

module.exports = {
	init: function(argv) {
		jdf.init(function(config) {
			initCommandWithArgs(argv, config);
		});
	}
};

function initCommandWithArgs(argv, config) {
	program
		.version(jdf.version())
		.usage('[commands] [options]');

	// 所有命令入口初始化
	initInstall();
	initBuild();
	initRelease();
	initOutput();
	initUpload(config);
	initWidget();
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
/**
 * 初始化install命令
 */
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