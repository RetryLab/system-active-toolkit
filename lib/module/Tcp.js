var FILE_NET_SNMP = require('../../config').FILE_NET_SNMP;
var file = require('../util/file');
var tool = require('../util/tool');
var _ = require('underscore');

function Tcp(options) {
	this.fullStat = {};
	this.interval = options.interval || 1;
	this.processList = [];
	this.keys = ['ActiveOpens', 'PassiveOpens', 'AttemptFails', 'EstabResets', 'InSegs', 'OutSegs', 'RetransSegs', 'InErrs', 'OutRsts'];
}

Tcp.prototype.readStat = function (callback) {
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
			if (/Tcp/.test(lineList[i])) {
				if (isFirstLine) {
					isFirstLine = false;
					continue;
				}
				var oriArr = lineList[i].split(' ').filter(Boolean).slice(1).map(tool.toInt).slice(0, self.keys.length);

				var valueMap = _.object(self.keys, oriArr);

				console.log(valueMap);

//				var statMap = self.processStat(key, valueMap);
//				result[key] = statMap;
				break;
			}
		}

		var result = {};
		self.fullStat = result;
		if (callback)
			callback(null, result);
	})
}

Tcp.prototype.processStat = function (key, valueMap) {

}
module.exports = Tcp
