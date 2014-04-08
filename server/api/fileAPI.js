var deck = require('./decks');	
var fs = require('fs');

exports.getFile = function(req, res) {
	var filename = req.params.filename;
	
	fs.readFile('../upload/ppt/' + filename, function(err,data) {
		console.log(data);
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
exports.putFile = function(req, res) {
	
	console.log(req.files.file.path);
	
//	gridFs.put(buffer, {}, function(err, fileInfo) {
//		if(!err) {
//			callback(fileInfo);
//			console.log('write file success!');
//		}
//	});
};
