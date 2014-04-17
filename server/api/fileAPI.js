var deck = require('./decks');	
var fs = require('fs');
var http = require('http');

exports.getFile = function(req, res) {
	var filename = req.params.filename;
	
	fs.readFile('../upload/ppt/' + filename, function(err,data) {
		if(!err){
			res.send(data);
		}
	});
	
//	gridFs.get(_id, function(err, data) {
//		if(err){
//			throw err;
//		}else{
//			callback(data);
//			fs.writeFile('c:\\my.iso', data, 'utf-8', function(err) {
//				if(!err) {
//					console.log('write file to local file system succeed!');
//				}
//			});
//		} 
//	});
};
exports.deleteFile = function(req, res) {
	
	
};
exports.putFile = function(req, resXM) {
	
	var paths = req.files.file.path.split("/");
	var filename = paths[paths.length - 1];
	
	console.log('upload ppt name: ' + filename);
	var url = "http://192.168.1.138:8080/PPT2DBAPI/APIForCloud?filename=" + filename;
	http.get(url, function(res) {
		var infos = '';
		 res.on('data',function(data){
		        infos += data;
		 }).on('end', function() {
			 	var fileId = null;
				fileId = JSON.parse(infos).id;
				console.log(fileId);
				deck.deckAPI.findById(fileId, function(data) {
					resXM.send(data);
				});
			});  
		}).on('error', function(e) {
			console.log("Got error: " + e.message);
		});
	
//	gridFs.put(buffer, {}, function(err, fileInfo) {
//		if(!err) {
//			callback(fileInfo);
//			console.log('write file success!');
//		}
//	});
};
