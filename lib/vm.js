/**
 * @vm
 */
var path = require('path');
var fs = require('fs');
var util = require('util');
var $ = require('./base.js');
var f = require('./file.js');
var jdf = require("./jdf.js");

var vmObj = JSON.parse(f.read("../test/lib/vm.json"));
var vmTpm = f.read("../test/lib/vm.vm");

var Velocity = require('velocityjs');
var a = Velocity.render(vmTpm, vmObj);
console.log(a);

//
/**
 * @#Helper
var Jsonify = Velocity.Jsonify;
var Parser  = Velocity.Parser;
var asts = Parser.parse('hello world $foo.');
var makeup = new Jsonify(asts);
console.log(makeup.toVTL())
 */