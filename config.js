var isProduction = process.env.NODE_ENV === 'production' ? true : false;
module.exports = {
	'FILE_NET_SNMP': isProduction ? '/proc/net/snmp' : __dirname + '/test/snmp',
	'FILE_STAT': isProduction ? '/proc/stat' : __dirname + '/test/stat',
	'FILE_MEMINFO': isProduction ? '/proc/meminfo' : __dirname + '/test/meminfo',
	'FILE_LOADAVG': isProduction? '/proc/loadavg' : ___dirname + '/test/loadavg',
	'FILE_TRAFFIC': isProduction? '/proc/net/dev' : ___dirname + '/test/dev'
}
