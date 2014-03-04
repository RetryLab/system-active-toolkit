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
			valueArr= lineList[i].match(/(\d+).(\d+)\s+(\d+).(\d+)\s+(\d+).(\d+)\s+(\d+)\/(\d+)\s+(\d+)/)
		}
		var result={};
		result['load1']= +((+valueArr[2]+ +valueArr[1]*100) /100).toFixed(2);
		result['load5']= +((+valueArr[4]+ +valueArr[3]*100) /100).toFixed(2);
		result['load15']= +((+valueArr[6]+ +valueArr[5]*100) /100).toFixed(2);
		result['runing']= +valueArr[7];
		result['threads']= +valueArr[8];
		self.fullStat = result;
		if (callback)
			callback(null, result);
	})
}
module.exports = Load
