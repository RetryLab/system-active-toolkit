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

//testMem();
//testCPU();
testTcp();
