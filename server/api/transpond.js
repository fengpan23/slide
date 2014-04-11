var http = require('http');
var config = require('./config.json');

exports.transpond = function(req, res) {
	var info = '';
	console.log(config);
	
	req.addListener('data', function(chunk){  
        info += chunk;  
     }).addListener('end', function(){ 
    	var data = JSON.parse(info);
    	console.log(data);
    	
    	var options = {
    			method: "get",  
    			  host: data.domain,
//    			  port: 8080,
    			  path: config.CN + '&id=' + data.deckId + '&filename=' + data.filename + '&picture=' + data.picture,
    			};
    	
    	var url = data.domain + options.path;
    	console.log(url);
    	
    	http.get(url, function(res) {
    		console.log("Got response: " + res.statusCode);
    	}).on('error', function(e) {
    		console.log("Got error: " + e.message);
    	});
     })  
//     var domain = "http://3a.sc.lxpt.cn/index.php?option=com_lxedu&task=api.getSlideShowId&format=json";
	res.send(true);
};
