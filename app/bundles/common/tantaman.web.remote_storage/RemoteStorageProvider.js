define(["Q",
	"model/DeckModel",
    "model/DeckCollectionModel"
], function(Q, DeckModel, DeckCollection) {
    "use strict";

    function RemoteStorageProvider() {
        this.name = "Remote Storage";
        this.id = "remotestorage";
        this.deck = new DeckModel();
    }

    RemoteStorageProvider.prototype = {
        // ls: function(cb) {
            // this.deckColect.fetch({
                // success: function(collection) {
                    // console.log(collection);
                    // cb(collection);
                // },
                // error: function() {
                    // alert('An error occurred while fetch decks');
                // }
            // });
            // return this;
        // },
        ready: function() {
			return true;
		},
		
		currentDeckId: function(id){
			 this.deck.set('_id', id);
		},

		bg: function() {

		},
		
		ls: function(path, regex) {
			// Paths are currently ignored
			//var numFiles = this.impl.length;
			var fnames = [];
			// for (var i = 0; i < numFiles; ++i) {
				// var fname = this.impl.key(i);
				// if (fname.indexOf(prefix) == 0 &&
					// (regex == null || regex.exec(fname) != null)) {
					// fnames.push(fname.substring(prefix.length));
				// }
			// }

			return Q(fnames);
		},


        rm: function() {
            // TODO: add this func to deleteDeck
            this.deck.removeItem();
            return this;
        },

        getContents: function(deckId, cb) {
            try {
            	this.deck.set('_id', deckId);
				this.deck.fetch({
					success: function(deck){
						cb(deck.attributes);
					}
				});
            	console.log(this.deck);
            } catch (e) {
                cb(null, e);
            }
            return this;
        },

        setContents: function(fname, data, cb) {
        	
//            if (data.id) {
//                this.deck.set('_id', data.id);
//            } else {
//                this.deck.set('_id', null);
////                this.deck.set('_id', this.deck.get('_id'));
//            }
            this.deck.set('filename', fname);
            this.deck.set('slides', data.slides);
            this.deck.set('activeSlide', data.activeSlide);
            this.deck.set('background', data.background);
            this.deck.set('picture', data.picture);
            var self = this;
            this.deck.save(null, {
                success: function(deck) {
                	console.log(deck);
                	var XMLHttp = new XMLHttpRequest();
                	
                	var picture = deck.get('picture').replace(/\+/g,"%2B");
                	
                	var url = "http://3a.sc.lxpt.cn/index.php?option=com_lxedu&task=api.getSlideShowId&format=json&filename=" + deck.get('filename') + "&id=" +deck.id + "&picture=" + picture;
                	
//                	XMLHttp.setRequestHeader("POWERED-BY-MENGXIANHUI", "Approve");  
//                	XMLHttp.setRequestHeader("Content-Type", "application/xml"); 
                	
                	XMLHttp.open('get', url);  
                	XMLHttp.onreadystatechange = function() {
                		  if (XMLHttp.readyState === 4) {
                		   console.log(XMLHttp);
                		  }else{
                			  console.log('XMLHttp open error: ' + XMLHttp.readyState);
                		  }
                	}
                	XMLHttp.send(null);
                	self.deck.set('_id',deck.id);
                	cb(deck.id);
//                	console.log(parent);
                	alert(deck.get('filename') + "--- 保存成功！");
                },
                error: function(err) {
                    cb(err);
                }
            });
            return Q(this.deck.get('_id'));
        }

    };

    return RemoteStorageProvider;
});
