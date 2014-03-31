var loadPresentation = function(cb) {
	var config = JSON.parse(localStorage.getItem('preview-config'));
//	var presentation = localStorage.getItem('preview-string');
//	if (presentation) {
//		document.body.innerHTML = presentation;
//	//	document.body.className = config.surface + " " + document.body.className;
//	}
	if('webkitRequestFileSystem' in window){
		window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	}else if('moz_requestFileSystem' in window){
	    //firefox
	    window.requestFileSystem = window.moz_requestFileSystem;
	}else{
	    //this browser is not suported
	}
	window.requestFileSystem(window.TEMPORARY, 5*1024*1024, function(fs) {
		fs.root.getFile('_presentView.txt', {}, function(fileEntry) {
		    fileEntry.file(function(file) {
			       var reader = new FileReader();

			       reader.onloadend = function(e) {
			    	   var presentation = this.result;
			    	   if (presentation) {
			    			document.body.innerHTML = presentation;
			    		//	document.body.className = config.surface + " " + document.body.className;
			    			if(cb)cb();
			    		}
			       };
			       reader.readAsText(file);
			    }, errorHandler);
		 }, errorHandler);
		
		 fs.root.getFile('_previousView.txt', {create: false}, function(fileEntry) {
	    	   fileEntry.remove(function() {
	    		      console.log('File removed.');
	    	   }, errorHandler);
	      }, errorHandler);
	}, errorHandler);
	
	var errorHandler = function(e) {
		 var msg = '';

		  switch (e.code) {
		    case FileError.QUOTA_EXCEEDED_ERR:
		      msg = 'QUOTA_EXCEEDED_ERR';
		      break;
		    case FileError.NOT_FOUND_ERR:
		      msg = 'NOT_FOUND_ERR';
		      break;
		    case FileError.SECURITY_ERR:
		      msg = 'SECURITY_ERR';
		      break;
		    case FileError.INVALID_MODIFICATION_ERR:
		      msg = 'INVALID_MODIFICATION_ERR';
		      break;
		    case FileError.INVALID_STATE_ERR:
		      msg = 'INVALID_STATE_ERR';
		      break;
		    default:
		      msg = 'Unknown Error';
		      break;
		  };

		  console.log('Error: ' + msg);
	};
};
