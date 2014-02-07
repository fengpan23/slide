var mongo = require('mongodb');
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
	//192.168.2.86
var server = new Server('127.0.0.1', 27017, {
    auto_reconnect: true
});

 var db = new Db('deckdb', server, {
    safe: true
});

db.open(function(err, db) {
    if (!err) {
        console.log("Connected to 'deckdb' database");
         db.collection('decks', {
            safe: true
        }, function(err, collection) {
            if (err) {
                console.log("The 'decks' collection doesn't exist. Creating it with sample data...");
         //  } else{
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving deck:' + id);
    db.collection('decks', function(err, collection) {
    	console.log(id);
        collection.findOne({
            '_id': new BSON.ObjectID(id)
        }, function(err, item) {
            res.send(item);
			console.log(item);
        });
    });
};

exports.findAll = function(req, res) {
	console.log("Find All deck");
    db.collection('decks', function(err, collection) {
        collection.find().toArray(function(err, items) {
            // items.forEach(function(item){
            //     console.log(item);
            // })
            res.send(items);
        });
    });
};

exports.addDeck = function(req, res) {
    var deck = req.body;
    console.log('Adding deck: ' + JSON.stringify(deck));
    db.collection('decks', function(err, collection) {
        collection.insert(deck, {
            safe: true
        }, function(err, result) {
            if (err) {
                res.send({
                    'error': 'An error has occurred'
                });
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.updateDeck = function(req, res) {
    var id = req.params.id;
    var deck = req.body;
    delete deck._id;
    console.log('Updating deck: ' + id);
    console.log(JSON.stringify(deck));
    db.collection('decks', function(err, collection) {
        collection.update({
            '_id': new BSON.ObjectID(id)
        }, deck, {
            safe: true
        }, function(err, result) {
            if (err) {
                console.log('Error updating deck: ' + err);
                res.send({
                    'error': 'An error has occurred'
                });
            } else {
                console.log('' + result + ' document(s) updated');
				delete deck.picture;
				console.log(deck);
                res.send(deck);
            }
        });
    });
};

exports.deleteDeck = function(req, res) {
    var id = req.params.id;
    console.log('Deleting deck: ' + id);
    db.collection('decks', function(err, collection) {
        collection.remove({
            '_id': new BSON.ObjectID(id)
        }, {
            safe: true
        }, function(err, result) {
            if (err) {
                res.send({
                    'error': 'An error has occurred - ' + err
                });
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var decks = [{
        fileName: "云课件开发",
        slides: [{
            "num": 0,
            "components": [{
                "TextBox": {
                    "silent": true
                },
                "x": 224,
                "y": 211,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "云课件开发<br>",
                "size": 116,
                "selected": false
            }, {
                "TextBox": {
                    "silent": true
                },
                "x": 362,
                "y": 425,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "<font color=\"#000000\">Lisystec co.</font><br>",
                "size": 52,
                "selected": false
            }, {
                "TextBox": {
                    "silent": true
                },
                "x": 374,
                "y": 499,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "<font color=\"#000000\">2013年6月6日</font><br>",
                "size": 33,
                "selected": false
            }],
            "z": 0,
            "impScale": 3,
            "rotateX": 0,
            "rotateY": 0,
            "rotateZ": 0,
            "selected": true,
            "active": true,
            "x": 427,
            "y": 288
        }, {
            "num": 8,
            "components": [{
                "TextBox": {
                    "silent": true
                },
                "x": 233,
                "y": 134,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "<font face=\"Lato, sans-serif\">支持的浏览器</font><br>",
                "size": 89,
                "selected": false
            }, {
                "TextBox": {
                    "silent": true
                },
                "x": 358,
                "y": 329,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "<ul><li>Chrome 10.0以上</li><li>Safari 5以上</li><li>Firefox 8.0以上</li><li>Android 2.3以上</li><li>iPhone 4以上</li></ul>",
                "size": 48,
                "selected": false
            }, {
                "src": "http://sokoban.ws/sokoplayer/Chrome.png",
                "type": "Image",
                "x": 243,
                "y": 323,
                "scale": {
                    "x": 0.22721151897624428,
                    "y": 0.22721151897624428,
                    "width": 58.166148857918536,
                    "height": 58.166148857918536
                },
                "imageType": "PNG",
                "selected": false
            }, {
                "src": "http://whiteappleer.tw/wp-content/uploads/2012/12/Safari_icon.png",
                "type": "Image",
                "x": 240,
                "y": 387,
                "scale": {
                    "x": 0.06461477708750687,
                    "y": 0.06461477708750687,
                    "width": 66.16553173760704,
                    "height": 66.16553173760704
                },
                "imageType": "PNG",
                "selected": false
            }, {
                "src": "http://www.iconarchive.com/download/i51115/deleket/software/Mozilla-Firefox.ico",
                "type": "Image",
                "x": 239,
                "y": 453,
                "scale": {
                    "x": 0.2568787328268659,
                    "y": 0.2568787328268659,
                    "width": 65.76095560367767,
                    "height": 65.76095560367767
                },
                "imageType": "ICO",
                "selected": false
            }, {
                "src": "http://www.iconpng.com/png/simply_google/android_w.png",
                "type": "Image",
                "x": 240,
                "y": 521,
                "scale": {
                    "x": 0.23053536758904788,
                    "y": 0.23053536758904788,
                    "width": 59.01705410279626,
                    "height": 59.01705410279626
                },
                "imageType": "PNG",
                "selected": false
            }, {
                "src": "http://upload.wikimedia.org/wikipedia/commons/5/59/IPhone_4_Mock_No_Shadow_PSD.png",
                "type": "Image",
                "x": 244,
                "y": 588,
                "scale": {
                    "x": 0.1112573572037683,
                    "y": 0.1112573572037683,
                    "width": 56.96376688832937,
                    "height": 56.96376688832937
                },
                "imageType": "PNG",
                "selected": false
            }],
            "z": 0,
            "impScale": 3,
            "rotateX": 0,
            "rotateY": 0,
            "rotateZ": 0,
            "selected": false,
            "active": false,
            "x": 222,
            "y": 422
        }, {
            "num": 1,
            "components": [{
                "TextBox": {
                    "silent": true
                },
                "x": 79,
                "y": 113,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "<font face=\"Gorditas, cursive\">Front-end Framworks</font>",
                "size": 79,
                "selected": false
            }, {
                "TextBox": {
                    "silent": true
                },
                "x": 193,
                "y": 249,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "<ul><li><span style=\"font-size: 72px; line-height: normal; font-family: Gorditas, cursive;\"><font color=\"#2c36c7\">jQuery</font></span><br></li><li><span style=\"line-height: normal;\"><span style=\"font-size: 72px;\"><font face=\"Gorditas, cursive\" color=\"#2cc74b\">impressJS</font></span></span></li><li><span style=\"line-height: normal;\"><span style=\"font-size: 72px;\"><font face=\"Gorditas, cursive\" color=\"#c7c72c\">Twitter Bootstrap</font></span></span></li><li><span style=\"line-height: normal;\"><span style=\"font-size: 72px;\"><font face=\"Gorditas, cursive\" color=\"#c7462c\">Sass Compass</font><br></span></span></li></ul>",
                "size": 72,
                "selected": false
            }],
            "z": 0,
            "impScale": 3,
            "rotateX": 0,
            "rotateY": 0,
            "rotateZ": 0,
            "selected": false,
            "active": false,
            "x": 177,
            "y": 298
        }, {
            "num": 4,
            "components": [{
                "TextBox": {
                    "silent": true
                },
                "x": 135,
                "y": 152,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "<font face=\"Abril Fatface, cursive\">Back-end Frameworks</font><br>",
                "size": 72,
                "selected": false
            }, {
                "TextBox": {
                    "silent": true
                },
                "x": 284,
                "y": 303,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "<ul><li><font face=\"Abril Fatface, cursive\"><span style=\"line-height: normal;\"><font color=\"#4d2626\">node.js</font></span><br></font></li><li><span style=\"line-height: normal;\"><font face=\"Abril Fatface, cursive\" color=\"#26274d\">backbone.js</font></span></li><li><span style=\"line-height: normal;\"><font face=\"Abril Fatface, cursive\" color=\"#264d2c\">require.js</font></span></li></ul>",
                "size": 60,
                "selected": false
            }],
            "z": 0,
            "impScale": 3,
            "rotateX": 0,
            "rotateY": 0,
            "rotateZ": 0,
            "selected": false,
            "active": false,
            "x": 228,
            "y": 139
        }, {
            "num": 2,
            "components": [{
                "TextBox": {
                    "silent": true
                },
                "x": 260,
                "y": 146,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "<font face=\"Fredoka One, cursive\">Data Storage</font><br>",
                "size": 81,
                "selected": false
            }, {
                "TextBox": {
                    "silent": true
                },
                "x": 272,
                "y": 279,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "<ul><li><span style=\"line-height: normal;\"><font face=\"Fredoka One, cursive\" color=\"#94168e\">localStorage</font></span></li><li><span style=\"line-height: normal;\"><font face=\"Fredoka One, cursive\" color=\"#166a94\">remoteStorage</font></span></li><li><font face=\"Fredoka One, cursive\" color=\"#169427\">SQLvsNoSQL</font></li><li><font face=\"Fredoka One, cursive\" color=\"#945916\">MongoDB</font><br></li></ul>",
                "size": 72,
                "selected": false
            }],
            "z": 0,
            "impScale": 3,
            "rotateX": 0,
            "rotateY": 0,
            "rotateZ": 0,
            "selected": false,
            "active": false,
            "x": 429,
            "y": 130
        }, {
            "num": 7,
            "components": [{
                "TextBox": {
                    "silent": true
                },
                "x": 312,
                "y": 172,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "<font face=\"Press Start 2P, cursive\">LocalStorage</font><br>",
                "size": 72,
                "selected": false
            }, {
                "TextBox": {
                    "silent": true
                },
                "x": 189,
                "y": 335,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "<font face=\"Press Start 2P, cursive\">一种利用浏览器来存储数据的协议.<br></font><font face=\"Press Start 2P, cursive\">LocalStorage 支持离线数据存储, <br>这点与cookies类似，且存储能力</font>更<br>强大。<font face=\"Press Start 2P, cursive\">&nbsp;</font><br>",
                "size": 48,
                "selected": false,
                "skewX": 0
            }],
            "z": 0,
            "impScale": 3,
            "rotateX": 0,
            "rotateY": 0,
            "rotateZ": 0,
            "selected": false,
            "active": false,
            "x": 638,
            "y": 149
        }, {
            "num": 5,
            "components": [{
                "TextBox": {
                    "silent": true
                },
                "x": 275,
                "y": 160,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "RemoteStorage<br>",
                "size": 72,
                "selected": false
            }, {
                "TextBox": {
                    "silent": true
                },
                "x": 199,
                "y": 282,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "<ul><li><span style=\"line-height: normal;\">一个远程存储的开源协议，</span></li></ul>可对传输数据加密.<br><ul><li><span style=\"line-height: normal;\">支持Json数据类型</span></li></ul><ul><li><span style=\"line-height: normal;\">支持绝大多数NoSQL数据库.</span><br></li></ul>",
                "size": 62,
                "selected": false
            }],
            "z": 0,
            "impScale": 3,
            "rotateX": 0,
            "rotateY": 0,
            "rotateZ": 0,
            "selected": false,
            "active": false,
            "x": 656,
            "y": 297
        }, {
            "num": 3,
            "components": [{
                "TextBox": {
                    "silent": true
                },
                "x": 115,
                "y": 114,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "<font face=\"Ubuntu, sans-serif\">Why NoSQL?</font>",
                "size": 72,
                "selected": false
            }, {
                "TextBox": {
                    "silent": true
                },
                "x": 122,
                "y": 264,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "<div><ul><li><span style=\"line-height: normal; font-size: 48px;\">为云端设计的数据库，</span><span style=\"line-height: normal; font-size: 48px;\">与SQL数据库<br>相比系统占用资源更少，</span><span style=\"line-height: normal; font-size: 48px;\">存储和读取<br>的速度更快。</span></li><li><span style=\"line-height: normal; font-size: 48px;\">不需要DBA，也不需要SQL语句，</span><span style=\"line-height: normal; font-size: 48px;\">直<br>接用方法来调用数据.</span></li><li><span style=\"line-height: normal; font-size: 48px;\">NoSQL便于添加新的property,</span><span style=\"line-height: normal; font-size: 48px;\">而SQL<br>则需要对table进行重新设计。</span></li></ul></div>",
                "size": 48,
                "selected": false
            }],
            "z": 0,
            "impScale": 3,
            "rotateX": 0,
            "rotateY": 0,
            "rotateZ": 0,
            "selected": false,
            "active": false,
            "x": 615,
            "y": 432
        }, {
            "num": 6,
            "components": [{
                "TextBox": {
                    "silent": true
                },
                "x": 322,
                "y": 64,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "MongoDB",
                "size": 72,
                "selected": false
            }, {
                "TextBox": {
                    "silent": true
                },
                "x": 177,
                "y": 252,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "<pre style=\"font-family: inconsolata, monospace; font-size: 14px; line-height: 19px;\">    \"namespace 1\": [\n        {\n            \"_id\": \"key 1\",\n            \"property 1\": \"value\",\n            \"property 2\": {\n                \"property 3\": \"value\",\n                \"property 4\": [ \"value\", \"value\", \"value\" ]\n            }, ...\n        },\n        {\n            \"_id\": \"key 2\",\n            \"property5\": {\n                \"property3\": \"value\",\n                \"property7\": { \"question\": \"6x9\", \"answer\": 42, \"list\": [ 3, 5 ] }\n            }, ...      \n        }, ...\n    ]</pre>",
                "size": 57,
                "selected": false
            }, {
                "TextBox": {
                    "silent": true
                },
                "x": 167,
                "y": 182,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "Optimised to store nested Json data<br>",
                "size": 44,
                "selected": false
            }, {
                "TextBox": {
                    "silent": true
                },
                "x": 123,
                "y": 617,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "the model is totally flexible. Any property can be added to any object any time. <br>Any property can be indexed, at any depth (for example, \"property3\"&nbsp;could be <br>indexed)<br>",
                "size": 24,
                "selected": false
            }],
            "z": 0,
            "impScale": 3,
            "rotateX": 0,
            "rotateY": 0,
            "rotateZ": 0,
            "selected": false,
            "active": false,
            "x": 398,
            "y": 471
        }, {
            "num": 9,
            "components": [{
                "TextBox": {
                    "silent": true
                },
                "x": 341,
                "y": 306,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "感谢阅读！",
                "size": 72,
                "selected": false
            }],
            "z": 0,
            "impScale": 3,
            "rotateX": 0,
            "rotateY": 0,
            "rotateZ": 0,
            "selected": false,
            "active": false,
            "x": 979,
            "y": 471
        }],
        activeSlide: {
            "num": 0,
            "components": [{
                "TextBox": {
                    "silent": true
                },
                "x": 224,
                "y": 211,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "云课件开发<br>",
                "size": 116,
                "selected": false
            }, {
                "TextBox": {
                    "silent": true
                },
                "x": 362,
                "y": 425,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "<font color=\"#000000\">Lisystec co.</font><br>",
                "size": 52,
                "selected": false
            }, {
                "TextBox": {
                    "silent": true
                },
                "x": 374,
                "y": 499,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "<font color=\"#000000\">2013年6月6日</font><br>",
                "size": 33,
                "selected": false
            }],
            "z": 0,
            "impScale": 3,
            "rotateX": 0,
            "rotateY": 0,
            "rotateZ": 0,
            "selected": true,
            "active": true,
            "x": 427,
            "y": 288
        },
        background: "defaultbg",
        picture: "/pics/saint_cosme.jpg"
    }, {
        fileName: "三角函数",
        slides: [{
            "num": 0,
            "components": [{
                "TextBox": {},
                "x": 327,
                "y": 165,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "<font face=\"宋体, sans-serif\">三角函数</font><br>",
                "size": 84,
                "selected": false
            }, {
                "TextBox": {},
                "x": 407,
                "y": 377,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "北京四中<br>",
                "size": 49,
                "selected": false
            }],
            "z": 0,
            "impScale": 3,
            "rotateX": 0,
            "rotateY": 0,
            "rotateZ": 0,
            "selected": false,
            "active": false,
            "x": 30,
            "y": 80
        }, {
            "num": 1,
            "components": [{
                "TextBox": {},
                "x": 112,
                "y": 89,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "请同学们看下图",
                "size": 58,
                "selected": false
            }, {
                "src": "data:image/png;base64,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",
                "type": "Image",
                "x": 211,
                "y": 227,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "imageType": "PNG",
                "selected": false
            }, {
                "TextBox": {},
                "x": 580,
                "y": 596,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "这个一个三角形<br>",
                "size": 49,
                "selected": false
            }],
            "z": 0,
            "impScale": 3,
            "rotateX": 0,
            "rotateY": 0,
            "rotateZ": 0,
            "selected": false,
            "active": false
        }, {
            "num": 2,
            "components": [{
                "TextBox": {},
                "x": 134,
                "y": 140,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "作业：<br>&nbsp; &nbsp; 请同学们用勾股定理<br>&nbsp; &nbsp; 证明。<br>",
                "size": 72,
                "selected": false
            }],
            "z": 0,
            "impScale": 3,
            "rotateX": 0,
            "rotateY": 0,
            "rotateZ": 0,
            "selected": true,
            "active": true
        }],
        activeSlide: {
            "num": 2,
            "components": [{
                "TextBox": {},
                "x": 134,
                "y": 140,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "作业：<br>&nbsp; &nbsp; 请同学们用勾股定理<br>&nbsp; &nbsp; 证明。<br>",
                "size": 72,
                "selected": false
            }],
            "z": 0,
            "impScale": 3,
            "rotateX": 0,
            "rotateY": 0,
            "rotateZ": 0,
            "selected": true,
            "active": true
        },
        background: "defaultbg",
        picture: "/pics/lan_rioja.jpg"
    }, {
        fileName: "小学作文",
        slides: [{
            "num": 0,
            "components": [{
                "TextBox": {},
                "x": 327,
                "y": 165,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "<font face=\"宋体, sans-serif\">小学语文</font><br>",
                "size": 84,
                "selected": false
            }, {
                "TextBox": {},
                "x": 407,
                "y": 377,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "北京八中<br>",
                "size": 49,
                "selected": false
            }],
            "z": 0,
            "impScale": 3,
            "rotateX": 0,
            "rotateY": 0,
            "rotateZ": 0,
            "selected": false,
            "active": false,
            "x": 30,
            "y": 80
        }, {
            "num": 1,
            "components": [{
                "TextBox": {},
                "x": 112,
                "y": 89,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "请同学们看图作文",
                "size": 58,
                "selected": false
            }, {
                "TextBox": {},
                "x": 122,
                "y": 589,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "限时60分钟<br>",
                "size": 49,
                "selected": false
            }, {
                "src": "data:image/jpeg;base64,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",
                "type": "Image",
                "x": 171,
                "y": 219,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "imageType": "JPEG",
                "selected": false
            }],
            "z": 0,
            "impScale": 3,
            "rotateX": 0,
            "rotateY": 0,
            "rotateZ": 0,
            "selected": true,
            "active": true
        }],
        activeSlide: {
            "num": 1,
            "components": [{
                "TextBox": {},
                "x": 112,
                "y": 89,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "请同学们看图作文",
                "size": 58,
                "selected": false
            }, {
                "TextBox": {},
                "x": 122,
                "y": 589,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "type": "TextBox",
                "text": "限时60分钟<br>",
                "size": 49,
                "selected": false
            }, {
                "src": "data:image/jpeg;base64,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",
                "type": "Image",
                "x": 171,
                "y": 219,
                "scale": {
                    "x": 1,
                    "y": 1
                },
                "imageType": "JPEG",
                "selected": false
            }],
            "z": 0,
            "impScale": 3,
            "rotateX": 0,
            "rotateY": 0,
            "rotateZ": 0,
            "selected": true,
            "active": true
        },
        background: "solid-bg-yellow",
        picture: "/pics/margerum.jpg"
    }, {
        fileName: "移动品牌营销之巅",
        slides: "2006",
        activeSlide: "Tempranillo",
        picture: "/pics/ex_umbris.jpg"
    }, {
        fileName: "咨询融入教学",
        slides: "2006",
        activeSlide: "Tempranillo",
        picture: "/pics/rex_hill.jpg"
    }, {
        fileName: "当下网页游戏市场",
        slides: "2006",
        activeSlide: "Tempranillo",
        picture: "/pics/viticcio.jpg"
    }, {
        fileName: "安卓应用的推广和广告盈利模式分析",
        slides: "2006",
        activeSlide: "Tempranillo",
        picture: "/pics/le_doyenne.jpg"
    }, {
        fileName: "Welcome to Slides",
        slides: "2006",
        activeSlide: "Tempranillo",
        picture: "/pics/bouscat.jpg"
    }, {
        fileName: "Functional Programming in 5 Minutes",
        slides: "2006",
        activeSlide: "Tempranillo",
        picture: "/pics/block_nine.jpg"
    }, {
        fileName: "MediaV 客户洞察",
        slides: "2006",
        activeSlide: "Tempranillo",
        picture: "/pics/domaine_serene.jpg"
    }, {
        fileName: "The Different Part of a Domain Name",
        slides: "2006",
        activeSlide: "Tempranillo",
        picture: "/pics/bodega_lurton.jpg"
    }, {
        fileName: "移动应用的安全性与防范机制",
        slides: "2006",
        activeSlide: "Tempranillo",
        picture: "/pics/morizottes.jpg"
    }, {
        fileName: "SOCI",
        slides: "2006",
        activeSlide: "Tempranillo",
        picture: "/pics/argiano.jpg"
    }, {
        fileName: "挖掘Windows Phone游戏的第一捅金",
        slides: "2006",
        activeSlide: "Tempranillo",
        picture: "/pics/dinastia.jpg"
    }, {
        fileName: "跨平台的开放时代",
        slides: "2006",
        activeSlide: "Tempranillo",
        picture: "/pics/petalos.jpg"
    }, {
        fileName: "资讯科技融入教学的发展与现状",
        slides: "2006",
        activeSlide: "Tempranillo",
        picture: "/pics/shafer.jpg"
    }, {
        fileName: "BAT-GAME生态统治下的移动方向",
        slides: "2006",
        activeSlide: "Tempranillo",
        picture: "/pics/ponzi.jpg"
    }, {
        fileName: "QCon全球软件开发大会（杭州）",
        slides: "2006",
        activeSlide: "Tempranillo",
        picture: "/pics/hugel.jpg"
    }, {
        fileName: "如何利用RTB与受众购买技术最大化广告效果",
        slides: "2006",
        activeSlide: "Tempranillo",
        picture: "/pics/fourvines.jpg"
    }, {
        fileName: "相信互联网的力量",
        slides: "2006",
        activeSlide: "Tempranillo",
        picture: "/pics/quivira.jpg"
    }, {
        fileName: "理想与现实间的选择",
        slides: "2006",
        activeSlide: "Tempranillo",
        picture: "/pics/calera.jpg"
    }, {
        fileName: "新系统，新平台，全新起航",
        slides: "2006",
        activeSlide: "Tempranillo",
        picture: "/pics/caronne.jpg"
    }, {
        fileName: "jPush应用精选",
        slides: "2006",
        activeSlide: "Tempranillo",
        picture: "/pics/momo.jpg"
    }, {
        fileName: "Programming Internet Security",
        slides: "2006",
        activeSlide: "Tempranillo",
        picture: "/pics/waterbrook.jpg"
    }];

    db.collection('decks', function(err, collection) {
        collection.insert(decks, {
            safe: true
        }, function(err, result) {});
    });

};
