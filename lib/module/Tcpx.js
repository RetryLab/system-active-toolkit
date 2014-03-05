var FILE_NET_SNMP = require('../../config').FILE_NET_SNMP;
var FILE_NET_NETSTAT = require('../../config').FILE_NET_NETSTAT;
var file = require('../util/file');
var tool = require('../util/tool');
var async = require('async');
var _ = require('underscore');

function Tcpx(options) {
	if (!options)
		options = {};
	this.fullStat = {};
	this.interval = options.interval || 1;
	this.processList = [];
//	this.filekeys = ['ActiveOpens', 'PassiveOpens', 'AttemptFails', 'EstabResets', 'InSegs', 'OutSegs', 'RetransSegs', 'InErrs', 'OutRsts'];
//	this.keys = ['tcplistenover', 'tcpembdrop', 'iseg', 'outseg', 'retran'];
	this.netstatKeys = ['tcplistenover', 'tcpembdrop', 'tcprexmitdrop'];
	this.netstatIndexes = [19, 57, 61];
	this.netSnmpKeys = ['activeopen', 'passiveopen'];
	this.netSnmpIndexes = [4, 5];


}

Tcpx.prototype.readNetStat = function (callback) {
	var self = this;
	file.getFileLines(FILE_NET_NETSTAT, function (err, lineList) {
		if (err) {
			console.error('ERROR: no such file: ', FILE_NET_NETSTAT);
			if (callback)
				callback('no such file: ', FILE_NET_NETSTAT)
			return;
		}

		var result = {};
		var isFirstLine = true;
		for (var i = 0, l = lineList.length; i < l; i++) {
			if (/TcpExt/.test(lineList[i])) {
				if (isFirstLine) {
					isFirstLine = false;
					continue;
				}
				var oriArr = lineList[i].split(' ').filter(Boolean).slice(1).map(tool.toInt);
				result = tool.mappingObj(self.netstatKeys, oriArr, self.netstatIndexes);
				break;
			}
		}
		callback(null, result);
	})
}

Tcpx.prototype.readNetSnmp = function (callback) {
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
				var oriArr = lineList[i].split(' ').filter(Boolean).slice(1).map(tool.toInt);
				result = tool.mappingObj(self.netSnmpKeys, oriArr, self.netSnmpIndexes);
				break;
			}
		}
		callback(null, result);
	})
}


Tcpx.prototype.readStat = function (callback) {
	var self = this;

	async.parallel({
		snmp: function (done) {
			self.readNetSnmp(function (err, result) {
				done(err, result);
			})
		},
		netstat: function (done) {
			self.readNetStat(function (err, result) {
				done(err, result);
			})
		}
	}, function (err, result) {
		if (err) {
			callback(err);
		} else {
			callback(null, _.extend(result.snmp, result.netstat));
		}
	})
}

Tcpx.prototype.processStat = function (valueMap) {
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

		if (curStat.retran >= preStat.retran && curStat.outseg > preStat.outseg) {
			stat.retran = (curStat.retran - preStat.retran) * 100 / (curStat.outseg - preStat.outseg);
		}

		if (stat.retran > 100) {
			stat.retran = 100;
		}
		statList.shift();
		return stat;
	} else {
		return _.object(this.keys, tool.initArray(this.keys.length, -1));
	}
}
module.exports = Tcpx


if (!module.parent) {
	var tcpx = new Tcpx();
	tcpx.readStat(function (err, stats) {
		console.log(err, stats);
	})
}