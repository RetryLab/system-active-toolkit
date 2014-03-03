var FILE_LOADAVG = require('../../config').FILE_LOADAVG;
var file = require('../util/file');
var tool = require('../util/tool');
var os = require('os');
var numCPUs = os.cpus().length;
var _ = require('underscore');

function Load() {
	this.processMap = {};
	this.fullStat = {};
	this.keys = ['load1', 'load5', 'load15', 'runing', 'threads'];
}

Load.prototype.readStat = function (callback) {
	var self = this;

	file.getFileLines(FILE_LOADAVG, function (err, lineList) {
		if (err) {
			console.error('ERROR: no such file: ', FILE_LOADAVG);
			if (callback)
				callback('no such file: ', FILE_LOADAVG)
			return;
		}

		var valueArr = [];
		for (var i = 0, l = lineList.length; i < l; i++) {
			valueArr = lineList[i].split(/\s+/g).filter(Boolean);
		}
		var result = _.object(self.keys, valueArr);
		result['load1']= [(result['load1']/ numCPUs).toFixed(1), result['load1']].join("/")
		result['load5']= [(result['load5']/ numCPUs).toFixed(1), result['load5']].join("/")
		result['load15']= [(result['load15']/ numCPUs).toFixed(1), result['load15']].join("/")
		self.fullStat = result;
		if (callback)
			callback(null, result);
	})
}
module.exports = Load
