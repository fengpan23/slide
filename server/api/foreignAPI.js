var deck = require('./decks');	

exports.findByTag = function(req, res) {
	var searchTag = req.params.searchTag;
	var skip = parseInt(req.params.skip) || 0;
	var limit = parseInt(req.params.limit) || 5;
	
	if(searchTag.length === 24){
		var isId = true;
		for(var i=0; i<searchTag.length; i++){
		    try{
		        var c = searchTag.substring(i, i+1);
		        var n = parseInt("0x" + c);
		        if(n > 15 || n < 0){
		        	isId = false; 
		            break;
		        }
		    }catch(e){
		    	isId = false; 
		        break;
		    }
		}
	}
	console.log(isId);
	if(isId){
		deck.deckAPI.findById(searchTag, function(result) {
			if(result){
				res.jsonp(result);
			}else{
				deck.deckAPI.findByTag(searchTag, skip , limit, function(result) {
					res.jsonp(result);
				});
			}
		});
	}else{
		deck.deckAPI.findByTag(searchTag, skip , limit, function(result) {
			res.jsonp(result);
		});
	}
};

exports.deleteDeck = function(req, res) {
	var  id = req.params.id;
	
	deck.deckAPI.deleteDeck(id, function(result) {
		res.jsonp(result);
	});
};

exports.addDeck = function(req, res) {
	 var data = req.body;
//	 console.log(req);
	 console.log(data);
//	 console.log(req.query);
	 deck.deckAPI.addDeck(data, function(result) {
			res.jsonp(result);
	 });
};

exports.findAllDeck = function(req, res) {
	var result = [];
	
	deck.deckAPI.findAll(function(results) {
		results.forEach(function(item){
			 result.push({
					id: item._id, 
		    		filename: item.filename,
		    		picture: item.picture
//		    		creator: item.creator, 
//		    		last_modified: item.last_modified,
//		    		quoteTimes: item.quoteTimes,
//		    		watchTimes: item.watchTimes,
//		    		deckVersion: item.deckVersion
			});
		});
		res.jsonp(result);
	});
};