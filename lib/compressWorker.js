/**
 * Created by wangshaoxing on 2014/12/12.
 */

var path = require('path');
var fs = require('fs');

//lib自身组件
var $ = require('./base.js');
var f = require('./file.js');
var Compress = require('./compress.js');

//外部组件
var UglifyJS = require("uglify-js");
var Pngquant = require('jdf-png-native');
var cpus = require('os').cpus();

process.on('message', function(data) {
    Compress.init(
    	data.task,
    	data.isdebug,
    	data.config,
    	data.getProject
    );
    process.send({tag:1,job:data.task});
});

process.send({tag:1,job:""});
