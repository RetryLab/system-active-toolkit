exports.toInt = function (v) {
	return isNaN(v) ? 0 : +v;
}

exports.getObjectSum = function (obj) {
	var total = 0;
	for (var key in obj) {
		if (!isNaN(obj[key]))
			total += +obj[key];
	}
	return total;
}

exports.initArray = function (length, initValue) {
	var arr = [];
	for (var i = 0; i < length; i++) {
		arr.push(initValue || 0)
	}
	return arr;
}

exports.bytesToSize = function (bytes) {
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes == 0) return 'n/a';
	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	if (i == 0) return bytes + ' ' + sizes[i];
	return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};