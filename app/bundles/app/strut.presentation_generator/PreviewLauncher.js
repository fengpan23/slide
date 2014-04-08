define(function() {
	'use strict';
	var launch = 0;

	function PreviewLauncher(editorModel) {
		this._editorModel = editorModel;
	};

	PreviewLauncher.prototype = {
		launch: function(generator) {
			if (window.previewWind)
				window.previewWind.close();

			this._editorModel.trigger('launch:preview', null);

			//use localStorage  Most support 5MB
//			var previewStr = generator.generate(this._editorModel.deck());
//			localStorage.setItem('preview-string', previewStr);
			
			
			//use FileSystem Temporarily saved data to support  greater than 5MB
			this.previewStr = generator.generate(this._editorModel.deck());
			var self = this;

			// To access the sandboxed file system (meaning two or more apps canÃ¢t access each others files) you need to initialize the FileSystem object:
			 
//			if('webkitRequestFileSystem' in window){
				window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem || window.moz_requestFileSystem;
//			}else if('moz_requestFileSystem' in window){
			    //firefox
//			    window.requestFileSystem = window.moz_requestFileSystem;
//			}else{
			    //this browser is not suported
//			}
			window.requestFileSystem(window.TEMPORARY, 5*1024*1024 , function(fs) {
			
				fs.root.getFile('_previousView.txt', {create: true}, function(fileEntry) {
					fileEntry.createWriter(function(fileWriter) {
				    	fileWriter.onwriteend = function(e) {
				    		console.log('Write completed.');
				    		fileEntry.moveTo(fs.root, '_presentView.txt');
				    	};
				    	fileWriter.onerror = function(e) {
				    		console.log('Write failed: ' + e.toString());
				    	};
				    	var blob = new Blob([self.previewStr], {type: 'text/plain'});
				    	fileWriter.write(blob);
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
			
			localStorage.setItem('preview-config', JSON.stringify({
				surface: this._editorModel.deck().get('surface')
			}));

			window.previewWind = window.open(
				'preview_export/' + (generator.file || generator.id) + '.html' + generator.getSlideHash(this._editorModel),
				window.location.href);
			var sourceWind = window;
		}
	};

	return PreviewLauncher;
});