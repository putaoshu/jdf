// 外部模块
var babel = require('babel-core');
var fs = require('fs')

// jdf内置模块
var f = require('./file.js');
var $ = require('./base.js');

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
                    var result = babel.transformFileSync(src, {presets:['es2015']});
                    f.write(dst , result.code);
                } catch (e) {
                    console.log('jdf error [jdf.buildES6] - babel\r\n' + src);
                    console.log(e);
                }
            }
        }
    }
}

exports.init = init;