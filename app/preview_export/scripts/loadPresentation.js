var loadPresentation = function(cb) {
	var config = JSON.parse(localStorage.getItem('preview-config'));
//	var presentation = localStorage.getItem('preview-string');
//	if (presentation) {
//		document.body.innerHTML = presentation;
//	//	document.body.className = config.surface + " " + document.body.className;
//	}
	
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;  
	window.requestFileSystem(window.TEMPORARY, 5*1024*1024, function(fs) {
		fs.root.getFile('_preview.txt', {}, function(fileEntry) {

		    fileEntry.file(function(file) {
		       var reader = new FileReader();

		       reader.onloadend = function(e) {
		    	   var presentation = this.result;
		    	   console.log(presentation);
		    	   if (presentation) {
		    			document.body.innerHTML = presentation;
		    		//	document.body.className = config.surface + " " + document.body.className;
		    			if(cb){
		    				cb();
		    			}
		    		}
		       };

		       reader.readAsText(file);
		    }, function(err) {
				console.log(err);
			});

		  }, function(err) {
			console.log(err);
		});

	}, function(err) {
		console.log(err);
	});
	
};
