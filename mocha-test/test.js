var expect = require('expect.js');
var fs = require('fs');
var child = require("child_process");
var path = require("path");
var child = require("child_process");

var fixtureDir = __dirname + '/fixtures';

var binPath = path.normalize(__dirname + '/../bin/');

fs.readdirSync(fixtureDir).forEach(function (subDir) {
	if (subDir[0] === '.') {
		return;
	}

	var testDir = fixtureDir + '/' + subDir;
	describe(subDir, function () {
		it('should')
		process.chdir(testDir + '/in-files');

		var spawn = child.spawn(process.execPath, [binPath + subDir]);    
		spawn.stderr.on("data", function (chunk) {
	      console.log(chu);
	    });

	    spawn.stdout.on("data", function (chunk) {
	      stdout += chunk;
	    });
		spawn.on('close', function (err) {
			console.log('finished');
			if (err) {
				throw err;
			}
		
		});

	});
});