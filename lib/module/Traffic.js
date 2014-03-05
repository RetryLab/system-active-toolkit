var FILE = require('../../config').FILE_NET_DEV;
var file = require('../util/file');
var tool = require('../util/tool');
var _ = require('underscore');

function Traffic() {
	this.processList = [];
	this.fullStat = {};
	this.keys = ['bytein', 'pktin', 'byteout', 'pktout'];
	this.valueIndexes = [0, 1, 8, 9];
}

Traffic.prototype.readStat = function (callback) {
	var self = this;

	file.getFileLines(FILE, function (err, lineList) {
		if (err) {
			console.error('ERROR: no such file: ', FILE);
			if (callback)
				callback('no such file: ', FILE)
			return;
		}
		var totalMap = _.object(self.keys, tool.initArray(self.keys.length, 0));
		for (var i = 0, l = lineList.length; i < l; i++) {
			if (/eth/.test(lineList[i]) || /em/.test(lineList[i])) {
				var values = lineList[i].split(" ").filter(Boolean).slice(1);
				// bytein, pktin, byteout, pktout
				// 0,1,8,9
				var valueMap = tool.mappingObj(self.keys, values, self.valueIndexes);
				for (var key in valueMap) {
					totalMap[key] += +valueMap[key];
				}
			}
		}

		var result = self.processStat(totalMap);

		for (var key in result) {
			result[key] = tool.bytesToSize(result[key]);
		}
		self.fullStat = result;
		if (callback)
			callback(null, result);
	})
}


Traffic.prototype.processStat = function (valueMap) {


	var statList = this.processList;
	statList.push(valueMap);

	if (statList.length > 1) {
		var curStat = statList[1];
		var preStat = statList[0];
		var stat = {};
		for (var key in curStat) {
			stat[key] = +curStat[key] - (+preStat[key]);
		}
		statList.shift();
		return stat;
	} else {
		return _.object(this.keys, tool.initArray(this.keys.length, 0));
	}
}

module.exports = Traffic
