var FILE_STAT = require('../../config').FILE_STAT;
var file = require('../util/file');
var tool = require('../util/tool');
var _ = require('underscore');

function Cpu() {
	this.processMap = {};
	this.fullStat = {};
	this.keys = ['user', 'nice', 'sys', 'idle', 'iowait', 'hardirq', 'softirq', 'steal', 'guest'];
}

Cpu.prototype.readStat = function (callback) {
	var self = this;

	file.getFileLines(FILE_STAT, function (err, lineList) {
		if (err) {
			console.error('ERROR: no such file: ', FILE_STAT);
			if (callback)
				callback('no such file: ', FILE_STAT)
			return;
		}

		var result = {};
		for (var i = 0, l = lineList.length; i < l; i++) {
			if (/cpu/.test(lineList[i])) {
				var oriArr = lineList[i].split(' ').filter(Boolean);
				// get cpu name of this line;
				var key = oriArr.shift();
				// convert to int and put into keys map
				var valueMap = _.object(self.keys, oriArr.map(tool.toInt).slice(0, self.keys.length));// remove first column and convert into inter array
				// get stat map;
				var statMap = self.processStat(key, valueMap);
				result[key] = statMap;
			} else {
				// ignore following data
				break;
			}
		}
		self.fullStat = result;
		if (callback)
			callback(null, result);
	})
}

Cpu.prototype.processStat = function (key, valueMap) {

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
		stat['util'] = 100 - (curStat['idle'] - preStat['idle']) * 100 / (curTotal - preTotal) - stat['iowait'];

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

module.exports = Cpu
