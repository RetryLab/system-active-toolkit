var Datastore = require('nedb'),
	config = require('../config').DB_PATH,
	db = new Datastore({ filename: config.DB_PATH, autoload: true });

exports.insertDB = function (dataMap) {
	var timeStamp = parseInt(Date.now() / 1000);
	dataMap.ts = timeStamp;
	db.insert(dataMap);
}

exports.getLatest= function(callback){
	db.findOne({}, function(err, result){
		callback(err, result);
	})
}


//
//if(!module.parent){
//	var dataMap= {
//		cpu:{
//			nice:1,
//			load: 3
//		},
//		mem: {
//			used:22334434
//		}
//	}
//	exports.insertDB(dataMap)
//
//	setTimeout(function(){
//		exports.getLatest(function(err, result){
//			console.log(err, result);
//		})
//	}, 1000);
//}