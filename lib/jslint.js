/**
 * @jslint代码质量检查
 * @ctime 2014-6-26 9:17
 */

var os = require('os');
var fs = require('fs');

var Jslint = require('atropa-jslint');

var f = require('./file.js');
var $ = require('./base.js');

function jslintInit(filename){
    var result = Jslint.JSLINT(f.read(filename));

    if(result) {
        console.log(os.EOL+filename+' is OK.');
    }else{
        console.log(os.EOL+filename);
        Jslint.JSLINT.errors.forEach(function (error, index) {
            if(error){
                console.log(
                    '#'+(index+1)+' ' + $.getVar(error.reason) + os.EOL +
                    '   '+ $.getVar(error.evidence).replace(/\t/g,'') 
                    + ' // Line '+$.getVar(error.line)
                    +', Pos '+  $.getVar(error.character)
                );
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
