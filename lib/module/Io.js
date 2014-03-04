var FILE = require('../../config').FILE_DISK_STATS;
var file = require('../util/file');
var tool = require('../util/tool');
var _ = require('underscore');

function Io() {
	this.processMap = {};
	this.fullStat = {};
	this.keys = ['free', 'buff', 'cach', 'total'];
	this.realKeys = ['MemFree:', 'Buffers:', 'Cached:', 'MemTotal:']
}

Io.prototype.readStat = function (callback) {
	var self = this;

	file.getFileLines(FILE, function (err, lineList) {
		if (err) {
			console.error('ERROR: no such file: ', FILE);
			if (callback)
				callback('no such file: ', FILE)
			return;
		}

		var keyValueObj = {};
		for (var i = 0, l = lineList.length; i < l; i++) {
			var oriArr = lineList[i].split(' ').filter(Boolean);
			keyValueObj[oriArr[0]] = +oriArr[1];
		}
		var valueArr = [];
		self.realKeys.forEach(function (item) {
			// push it and convert to byte
			valueArr.push(keyValueObj[item] << 10);
		})
		var result = _.object(self.keys, valueArr);

		result['used'] = result['total'] - result['free'] - result['buff'] - result['cach'];
		result['util'] = +(result['used'] * 100 / result['total']).toFixed(2);
		for (var key in result) {
			if (key === 'util')
				continue;
			result[key] = tool.bytesToSize(result[key]);
		}
		self.fullStat = result;
		if (callback)
			callback(null, result);
	})
}
module.exports = Io
