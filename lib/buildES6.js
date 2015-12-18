// 外部模块
var babel = require('babel-core');
var fs = require('fs')
var path = require('path');

// jdf内置模块
var f = require('./file.js');
var $ = require('./base.js');
var jdf = require('./jdf');

function init (src, dst) {
    src = f.realpath(src);
    if (src) {
        if (f.isDir(src)) {
            fs.readdirSync(src).forEach(function (name) {
                if (! name.match(/^\./)) {
                    init(src + '/' + name, dst + '/' + name);
                }
            });
        } else if (f.isFile(src)) {
            if ($.is.babel(src)) {
                dst = $.getJsExtname(dst);
                try {
                    var result = babel.transformFileSync(src, {
                        presets: $.uniq(jdf.config.babel.defaultPresets.concat(jdf.config.babel.presets || [])),
                        plugins: $.uniq(jdf.config.babel.defaultPlugins.concat(jdf.config.babel.plugins || [])),
                        sourceMaps: true
                    });
                    f.write(dst , result.code + '\n\n//# sourceMappingURL=./' + path.basename(dst) + '.map');
                    result.map.file = path.basename(dst);
                    f.write(dst + '.map', JSON.stringify(result.map));
                } catch (e) {
                    console.log('jdf error [jdf.buildES6] - babel\r\n' + src);
                    console.log(e);
                }
            }
        }
    }
}

exports.init = init;