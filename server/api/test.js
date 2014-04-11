var http = require('http');

exports.test = function(req, res) {
	console.log('tessss');
	
	var options = {
			method: "get",  
			  host: 'http://lxpt.mlyu.lxpt.cn',
//			  port: 8080,
			  path: '/api/user/login.json',
			};
	
	var url = "http://192.168.2.76:8080/HelloWorldServlet/HelloWorld1?id=100";

		
//		http.get(url, 
//				function(theRes) {
//		 		theRes.on('data', function (chunk) {
//	                tempStr = tempStr + chunk;
//	                    });
//	                    
//	                    theRes.on('end', function(){
//	                    	console.log(tempStr);
//	   					var return_json = JSON.parse(tempStr);                       
//						res.jsonp(return_json);
//	   				});
//
//	  			}).on('error', function(E) {
//	    		console.log("Got error: " + e.message);
//	  		});
//		
//			
//		});	
//		
	http.get(url, function(res) {
		
		console.log('aaaaaaaaaaaaaaaaa');
			console,log(res);
	       res.on('data', function (chunk) {
	        var  data = JSON.parse(""+chunk);
	         
	        res.send(data);
	         console.log(data)
//			        console.log('BODY: ' + data.statuses[0].user.id)
	  });
	}).on('error', function(e) {
//		res.send(e.message);
	  console.log("Got error: " + e.message);
	});
		
};
