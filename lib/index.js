function testCPU() {
	var Cpu = require('./module/Cpu');

	var cpu = new Cpu();

	setInterval(function () {
		cpu.readStat(function (err, stat) {
			console.log('CPU stat: ', JSON.stringify(stat['cpu']));
//		console.log('Stat: ==>', stat, "changes: ==>", cpu.changes);
		})
	}, 1000)

}

function testMem() {
	var Mem = require('./module/Mem');

	var mem = new Mem();

	setInterval(function () {
		mem.readStat(function (err, stat) {

			console.log('MEM stat:', JSON.stringify(stat));
		})
	}, 1000)
}

function testTcp() {
	var Tcp = require('./module/Tcp');
	var tcp = new Tcp();

	setInterval(function () {
		tcp.readStat(function (err, stat) {

			console.log('tcp stat:', JSON.stringify(stat));
		})
	}, 1000)
}


function testTcpx() {
	var Tcpx = require('./module/Tcpx');
	var tcpx = new Tcpx();

	setInterval(function () {
		tcpx.readStat(function (err, stat) {

			console.log('tcpx stat:', JSON.stringify(stat));
		})
	}, 1000)
}

function testLoad() {
	var Load = require('./module/Load');

	var load = new Load();

	setInterval(function () {
		load.readStat(function (err, stat) {

			console.log('Load stat:', JSON.stringify(stat));
		})
	}, 1000)
}

function testTraffic() {
	var Traffic = require('./module/Traffic');
	var traffic = new Traffic();
	setInterval(function () {
		traffic.readStat(function (err, stat) {
			console.log('Traffic stat:', JSON.stringify(stat));
		})
	}, 1000)
}

testCPU();
testMem();
testTcp();
testTcpx();
testLoad();
testTraffic();