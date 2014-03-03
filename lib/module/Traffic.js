var FILE_TRAFFIC = require('../../config').FILE_TRAFFIC;
var file = require('../util/file');
var tool = require('../util/tool');
var _ = require('underscore');

function Traffic() {
	this.processMap = {};
	this.fullStat = {};
	this.keys = ['bytein', 'pktin', 'byteout', 'pktout'];
}

Traffic.prototype.readStat = function (callback) {
	var self = this;

	file.getFileLines(FILE_TRAFFIC, function (err, lineList) {
		if (err) {
			console.error('ERROR: no such file: ', FILE_TRAFFIC);
			if (callback)
				callback('no such file: ', FILE_TRAFFIC)
			return;
		}
		var result ={};
		for (var i = 0, l = lineList.length; i < l; i++) {
			if(/eth/.test(lineList[i])){
				var valueArr = lineList[i].split(/\s+/g).filter(Boolean);
				result[self.keys[0]]= self.processStat(self.keys[0], valueArr[1])
				result[self.keys[1]]= self.processStat(self.keys[1], valueArr[2])
				result[self.keys[2]]= self.processStat(self.keys[2], valueArr[9])
				result[self.keys[3]]= self.processStat(self.keys[3], valueArr[10])

			}
		}
		// var result = _.object(self.keys, valueArr);
		self.fullStat = result;
		if (callback)
			callback(null, result);
	})
}


Traffic.prototype.processStat = function (key, valueMap) {

	if (!this.processMap[key])
		this.processMap[key] = [];
	var statList = this.processMap[key];
	statList.push(valueMap);

	if (statList.length > 1) {

		var curStat = statList[1];
		var preStat = statList[0];
		var stat = {};

		var curTotal = tool.getObjectSum(curStat);
		var preTotal = tool.getObjectSum(preStat);

		for (var key in curStat) {
			stat[key] = (curStat[key] - preStat[key]) * 100 / (curTotal - preTotal);
		}
		// stat['util'] = 100 - (curStat['idle'] - preStat['idle']) * 100 / (curTotal - preTotal) - stat['iowait'];

		//format stat, to fixed 2
		for (var key in stat) {
			stat[key] = +stat[key].toFixed(2);
		}
//		console.log("curStat", JSON.stringify(curStat), "\npreStat", JSON.stringify(preStat), "\nstat", JSON.stringify(stat), "\ncurTotal", curTotal, "\npreTotal", preTotal);
		statList.shift();
		return stat;
	} else {
		return _.object(this.keys, tool.initArray(this.keys.length, 0));
	}
}

module.exports = Traffic
