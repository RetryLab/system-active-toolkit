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


Traffic.prototype.processStat = function (key, value) {

	if (!this.processMap[key])
		this.processMap[key] = [];
	var statList = this.processMap[key];
	statList.push(value);

	if (statList.length > 1) {

		var curStat = statList[1];
		var preStat = statList[0];
		var stat = 0;
		stat = (curStat + preStat) /2 
		statList.shift();
		return +stat;
	} else {
		return +value;
	}
}

module.exports = Traffic
