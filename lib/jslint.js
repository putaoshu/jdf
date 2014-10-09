/**
 * @jslint代码质量检查
 * @ctime 2014-6-26 9:17
 */

var os = require('os');
var fs = require('fs');
var colors = require('colors');

var Jslint = require('atropa-jslint');

var f = require('./file.js');
var $ = require('./base.js');

function jslintInit(filename){
    var result = Jslint.JSLINT(f.read(filename));

    if(result) {
        console.log(os.EOL+filename+' is OK.');
    }else{
        console.log(os.EOL + 'jdf jslint: ' + filename);
        Jslint.JSLINT.errors.forEach(function (error, index) {
            if(error){
                console.log('#'+(index+1));
                console.log(colors.red('>>'), 'line: ' + $.getVar(error.line) + ', column: ' + $.getVar(error.character));
                console.log(colors.red('>>'), 'msg: ' + $.getVar(error.reason));
                console.log(colors.red('>>'), 'at: ' + $.getVar(error.evidence).replace(/\t/g,''));
            }
        });
    }
}

exports.init = function(filename){
    if(f.isDir(filename)){
        var filelist = f.getdirlist(filename, 'js$');
        filelist.forEach(function(item){
            jslintInit(item);
        })
    }else if(f.isFile(filename) && $.is.js(filename)){
       jslintInit(filename);
    }    
}
