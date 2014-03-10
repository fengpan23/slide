var express = require('express'),
    path = require('path'),
    http = require('http'),
//	fs = require('fs'),
//	url = require('url'),
	deck = require('./server/api/decks');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 5858);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser({limit: '50mb'})), // parses request body and populates req.body Request Entity limit 5mb
    app.use(express.methodOverride()); // checks req.body for HTTP method overrides
    app.use(app.router); // perform route lookup based on url and HTTP method
    app.use(express.static(path.join(__dirname, 'app'))); // root path folder
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true })); // Show all errors
});

app.get('/decks', deck.findAll);
app.get('/decks/:id', deck.findById);
app.post('/decks', deck.addDeck);
app.put('/decks/:id', deck.updateDeck);
app.delete('/decks/:id', deck.deleteDeck);

//app.get('/img/*/*.(jpg|png|jpeg){1}', function(req, res, next){
//	var realpath = __dirname + '/static' + url.parse(req.url).pathname;
//	if(path.existsSync(realpath)){
//		res.end(fs.readFileSync(realpath));
//    }else{
//        res.end('Cannot find request url: '+req.url);
//    }
//});
//
//
//app.post('/img', function(req, res){
//	 var tmp_path = req.files.image.path;
//	 var _date=new Date();
//	 var floder= __dirname + '/static/img/';
//	 var datedir=_date.getFullYear();
//	 var mm=_date.getMonth()+1;
//	 
//	 if(mm<10){
//		 datedir+="0"+mm;
//	 }else{
//		 datedir+=mm.toString();
//	 }
//	 floder+=datedir;
//	 if (!fs.existsSync(floder)) {
//		 fs.mkdirSync(floder);
//	}
//	 var target_path = floder + '/' + req.files.image.name;
//	 fs.rename(tmp_path, target_path, function(err) {
//		 if (err) throw err;
//		 fs.unlink(tmp_path, function() {
//			 if (err){
////				 res.send('File uploaded to: ' + target_path + ' - ' + req.files.Filedata.size + ' bytes');
//				 throw err;
//			 }
//			 res.send({data: {link: 'http://appdev.lxpt.cn:5858/img/'+datedir+'/'+req.files.image.name}, success: true});
//		 });
// 	});
//});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
