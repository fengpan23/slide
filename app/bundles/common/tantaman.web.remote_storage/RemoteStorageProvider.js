define(["Q",
	"model/DeckModel",
    "model/DeckCollectionModel"
], function(Q, DeckModel, DeckCollection) {
    "use strict";
    
    var reg = /http:\/\/([^\/]+)\//i;
    
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
            this.deck.set('surface', data.surface);
            this.deck.set('last_modified', data.last_modified);
            var self = this;
            this.deck.save(null, {
                success: function(deck) {
                	var referrer = window.document.referrer;
//                	var domain = referrer.substring(0, referrer.indexOf('?'));
//                	var referrer = "http://3a.sc.lxpt.cn/139/index.php";
//                	var domain = "mlyu.lxpt.cn";
                	var  domain = referrer.match(reg);
                	
                	if(domain){
                		domain = domain[1]
                		console.log(domain);
		            	var data = {
		            		domain: domain,
		            		filename: deck.get('filename'),
		            		deckId: deck.id,
		            		picture: deck.get('picture')
		            		//.replace(/\+/g,"%2B")
		            	};
		            	
		            	var XMLHttp = new XMLHttpRequest();
		            	XMLHttp.open('post', 'transpond');  
		            	XMLHttp.onreadystatechange = function() {
		            		  if (XMLHttp.readyState === 4) {
		            			  console.log(XMLHttp.responseText);
		            		  }else{
		            			  console.log('XMLHttp open error: ' + XMLHttp.readyState);
		            		  }
		            	};
		            	XMLHttp.send(JSON.stringify(data));
                	}
                	
                	self.deck.set('_id',deck.id);
                	cb(deck.id);
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
