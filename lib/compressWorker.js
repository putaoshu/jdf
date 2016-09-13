/**
 * Created by wangshaoxing on 2014/12/12.
 */

var path = require('path');
var fs = require('fs');

//lib自身组件
var $ = require('./base.js');
var f = require('./file.js');
var compress = require('./compress.js');
var jdf = require('./jdf.js');


process.on('message', function(data) {

    compress.init(
        data.task,
        data.isdebug,
        data.config,
        data.getProject,
        function() {
            process.send({ tag: 1, job: data.task });
        }
    );


    // if (jdf.config.output.webp) {
    //     compress.init(
    //         data.task,
    //         data.isdebug,
    //         data.config,
    //         data.getProject,
    //         function(){
    //          process.send({ tag: 1, job: data.task });
    //         }
    //     );
    // } else {
    //     compress.init(
    //         data.task,
    //         data.isdebug,
    //         data.config,
    //         data.getProject
    //     );
    //     process.send({ tag: 1, job: data.task });
    // }

});

process.send({ tag: 1, job: "" });
