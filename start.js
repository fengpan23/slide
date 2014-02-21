var express = require('express'),
    path = require('path'),
    http = require('http'),
//	deck = require('./server/api/test');
	deck = require('./server/api/decks');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser({limit: '50mb'})), //parses request body and populates req.body   Request Entity limit 5mb
    app.use(express.methodOverride()); //checks req.body for HTTP method overrides
    app.use(app.router); //perform route lookup based on url and HTTP method
    app.use(express.static(path.join(__dirname, 'app'))); // root path folder
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true })); //Show all errors
});

app.get('/decks', deck.findAll);
app.get('/decks/:id', deck.findById);
app.post('/decks', deck.addDeck);
app.put('/decks/:id', deck.updateDeck);
app.delete('/decks/:id', deck.deleteDeck);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
