var mongo = require('mongodb');
var fs = require('fs');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('127.0.0.1', 27017, {
    auto_reconnect: true
});

var db = new Db('deckdb', server, {
    safe: true
});

var gridFs = new mongo.Grid(db, 'fs');

db.open(function(err, db) {
    if (!err) {
        console.log("Connected to 'deckdb' database");
         db.collection('decks', {
            safe: true
        }, function(err, collection) {
            if (err) {
                console.log("The 'decks' collection doesn't exist. Creating it with sample data...");
            }
        });
    }
});

exports.deckAPI = {
	findById: function(id, callback) {
	    db.collection('decks', function(err, collection) {
	        collection.findOne({
	            '_id': new BSON.ObjectID(id)
	        }, function(err, item) {
	        	if(err){
	        		console.log("findById fail: " + err);
	        		return callback(false);
	        	}
	        	return callback(item);
	        });
	    });
	},
	findAll: function(callback) {
		db.collection('decks', function(err, collection) {
			collection.find().toArray(function(err, items) {
			   return callback(items);
			});
	    });
	},
	findByTag: function(tag, skip, limit, callback) {
		var result = [];
		var data = [];
		
		console.log(tag);
		console.log(skip);
		console.log(limit);
		
		db.collection('decks', function(err, collection) {
	    	collection.count({
	            'filename': {$regex: tag, $options: 'i'} //search filename where content filename
	        }, function(err, count) {
				result.push([{count: count}]);
				collection.find({
					'filename': {$regex: tag, $options: 'i'} //search filename where content filename
				}).skip(skip).limit(limit).toArray(function(err, items) {
					items.forEach(function(item){
						data.push({id: item._id, filename: item.filename, picture: item.picture});
					})
					result.push(data);
					return callback(result);
				});
			});
	    });
	},
	updateDeck: function(id, deck, callback) {
		 db.collection('decks', function(err, collection) {
	        collection.update({
	            '_id': new BSON.ObjectID(id)
	        }, deck, {
	            safe: true
	        }, function(err, result) {
	            if (err) {
	                console.log('Error updating deck: ' + err);
	               return callback(err);
	            } else {
	                console.log(result + ' document(s) updated');  //result is affect the number of rows
	                return callback(result);
	            }
	        });
	    });
	},
	addDeck: function(deck, callback) {
	    db.collection('decks', function(err, collection) {
	        collection.insert(deck, {
	            safe: true
	        }, function(err, data) {
	            if (err) {
	            	console.log("add Deck error: " + err);
	                return callback(err);
	            } else {
	                console.log('addDeck Success: ' + JSON.stringify(data[0]._id));
	                return callback(data[0]);
	            }
	        });
	    });
	},
	deleteDeck: function(id, callback) {
		 db.collection('decks', function(err, collection) {
	        collection.remove({
	            '_id': new BSON.ObjectID(id)
	        }, {
	            safe: true
	        }, function(err, result) {
	            if (err) {
	            	console.log("delete deck error: " + err);
	                return callback(err);
	            } else {
	            	console.log(result + " delete deck success ");
	            	return callback(result);
	            }
	        });
		});
	}
};

exports.fileAPI = {
	getFile: function(id, callback) {
		gridFs.get(id, function(err, data) {
			if(err){
				throw err;
			}else{
				callback(data);
//				fs.writeFile('c:\\my.iso', data, 'utf-8', function(err) {
//					if(!err) {
//						console.log('write file to local file system succeed!');
//					}
//				});
			} 
		});
	},
	deleteFile: function(id, callback) {
		
		
	},
	putFile: function(path, callback) {
		gridFs.put(buffer, {}, function(err, fileInfo) {
			if(!err) {
				callback(fileInfo);
				console.log('write file success!');
			}
		});
	}
};