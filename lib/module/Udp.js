var FILE_NET_SNMP = require('../../config').FILE_NET_SNMP;
var file = require('../util/file');
var tool = require('../util/tool');
var _ = require('underscore');

function Udp(options) {
	if (!options)
		options = {};
	this.fullStat = {};
	this.interval = options.interval || 1;
	this.processList = [];
//	this.filekeys = ['ActiveOpens', 'PassiveOpens', 'AttemptFails', 'EstabResets', 'InSegs', 'OutSegs', 'RetransSegs', 'InErrs', 'OutRsts'];
	this.keys = ['InDatagrams', 'NoPorts', 'InErrors', 'OutDatagrams'];
}

Udp.prototype.readStat = function (callback) {
	var self = this;

	file.getFileLines(FILE_NET_SNMP, function (err, lineList) {
		if (err) {
			console.error('ERROR: no such file: ', FILE_NET_SNMP);
			if (callback)
				callback('no such file: ', FILE_NET_SNMP)
			return;
		}

		var result = {};
		var isFirstLine = true;
		for (var i = 0, l = lineList.length; i < l; i++) {
			if (/Udp/.test(lineList[i])) {
				if (isFirstLine) {
					isFirstLine = false;
					continue;
				}
				var oriArr = lineList[i].split(' ').filter(Boolean).slice(1).map(tool.toInt);
				// sequence=> ActiveOpens, PassiveOpens, InSegs, OutSegs, RetransSegs
				var valueMap = tool.mappingObj(self.keys, oriArr);
				result = self.processStat(valueMap);
				break;
			}
		}

		self.fullStat = result;
		if (callback)
			callback(null, result);
	})
}

Udp.prototype.processStat = function (valueMap) {
	this.processList.push(valueMap);
	var statList = this.processList;
	if (statList.length > 1) {
		var curStat = statList[1];
		var preStat = statList[0];
		var stat = {};

		for (var key in curStat) {
			if (curStat[key] >= preStat[key]) {
				stat[key] = (curStat[key] - preStat[key]) / this.interval;
			}
		}
		statList.shift();
		return stat;
	} else {
		return _.object(this.keys, tool.initArray(this.keys.length, -1));
	}
}
module.exports = Udp
