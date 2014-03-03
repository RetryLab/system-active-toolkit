var fs = require('fs'),
	readline = require('readline');

exports.getFileLines = function (filePath, callback) {
	var lineList = [];
	fs.exists(filePath, function (exists) {
		if (exists) {
			var rl = readline.createInterface({
				input: fs.createReadStream(filePath),
				output: process.stdout,
				terminal: false
			});

			rl.on('line', function (line) {
				lineList.push(line);
			});

			rl.on('close', function () {
				callback(null, lineList);
			});
		} else {
			callback('not existed file: ' + filePath, []);
		}
	})
}

if (!module.parent) {
	exports.getFileLines(__dirname + '/../../test/stat', function (err, lineList) {
		console.log(lineList);
	});
}

