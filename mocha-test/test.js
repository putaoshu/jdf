var expect = require('expect.js');
var fs = require('fs');
var child = require("child_process");
var path = require("path");
var child = require("child_process");
var readdir = require("fs-readdir-recursive");
var pathExists = require('path-exists');

var fixtureDir = __dirname + '/fixtures';

var binPath = path.normalize(__dirname + '/../bin/');

function removeTimestamp (content) {
	var lines = content.split(/\r\n/);
	if (lines[0].match(/^\/\*.*Date:.*\*\/$/)) {
		lines.shift();
	}
	return lines.join(/\r\n/);
}

fs.readdirSync(fixtureDir).forEach(function (subDir) {
	if (subDir[0] === '.') {
		return;
	}

	var testDir = fixtureDir + '/' + subDir;
	describe(subDir, function () {
		this.timeout(10000);

		var infilesPath = testDir + '/in-files';
		var outfilesPath = testDir + '/out-files';
		var outfiles = readdir(outfilesPath);

		before(function (done) {
			process.chdir(infilesPath);
			var spawn = child.spawn(process.execPath, (binPath + subDir).split(/\s+/));  

			spawn.on('close', function (err) {
				done();
			});
		
		});

		outfiles.forEach(function (outfile) {
			var testName = path.basename(outfile).replace(/\.\S+$/, '');

			it(testName, function () {
				if (pathExists.sync(infilesPath + '/' + outfile)) {
					var standardContent = fs.readFileSync(outfilesPath + '/' + outfile).toString();
					var testContent = fs.readFileSync(infilesPath + '/' + outfile).toString();
					expect(testContent).to.contain(standardContent);
				}
				else {
					throw('Cannot find output file!');
				}
			});
		});
	});
});