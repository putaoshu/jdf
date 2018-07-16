'use strict';

var gitclone = require('git-clone');
var jdf = require('./jdf.js');
var f = require('./file.js');

var wx = module.exports = {};

var template = jdf.config.wxTemplate;

wx.init = function(dir) {
  console.log('git clone mini template:' + template);

  if (f.exists(dir)) {
    console.log('jdf warnning : dir [' + dir + '] is exists');
    return;
  }

  gitclone(template, dir, function(err) {
    if (err === undefined) {
      f.del(dir + '/.git');
      console.log('git clone success...');
    } else {
      console.log(err);
    }
  })
}

wx.page = function(name) {
  var pageDir = 'pages/' + name;
  var pageArr = [name + '.js', name + '.json', name + '.wxml', name + '.wxss'];

  if (f.exists(pageDir)) {
    console.log('jdf warnning : page [' + name + '] is exists');
    return;
  }

  f.mkdir(pageDir);

  pageArr.forEach(function(item) {
    f.write(pageDir + '/' + item, '');
  });
}