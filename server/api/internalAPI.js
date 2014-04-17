var deck = require('./decks');

exports.findById = function(req, res) {
	var id = req.params.id;
	
	deck.deckAPI.findById(id, function(result) {
		res.send(result);
	});
};

exports.searchByTag = function(req, res) {
	var searchTag = req.params.searchTag;
	var skip = parseInt(req.params.skip);
	var limit = parseInt(req.params.limit);
	
	deck.deckAPI.searchByTag(searchTag, skip , limit, function(result) {
		res.jsonp(result);
	});
};

exports.updateDeck = function(req, res) {
	 var id = req.params.id;
	 var data = req.body;
	 
	 delete data._id;
	  
	 deck.deckAPI.updateDeck(id, data, function(result) {
		 res.send(data);
	 });
};

exports.deleteDeck = function(req, res) {
	var  id = req.params.id;
	
	deck.deckAPI.deleteDeck(id, function(result) {
		res.send(req.body);
	});
};

exports.addDeck = function(req, res) {
	 var data = req.body;
	 console.log(data);
	 deck.deckAPI.addDeck(data, function(result) {
			res.send(result);
	 });
};

exports.findAllDeck = function(req, res) {
	var result = [];
	
	deck.deckAPI.findAll(function(results) {
		results.forEach(function(item){
			delete item.activeSlide;
			delete item.slides;
			delete item.picture;
			delete item.background;
			result.push(item);
//	    	 result.push({
//				id: item._id, 
//	    		filename: item.filename, 
//	    		creator: item.creator, 
//	    		last_modified: item.last_modified,
//	    		quoteTimes: item.quoteTimes,
//	    		watchTimes: item.watchTimes,
//	    		deckVersion: item.deckVersion
//			});
	     });
		res.send(result);
	});
};