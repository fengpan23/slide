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
			window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;  
			window.requestFileSystem(window.TEMPORARY, 5*1024*1024 , function(fs) {
				fs.root.getFile('_preview.txt', {create: true}, function(fileEntry) {
					
				    fileEntry.createWriter(function(fileWriter) {
				    	fileWriter.onwriteend = function(e) {
				    		console.log('Write completed.');
				    	};
				    	fileWriter.onerror = function(e) {
				    		console.log('Write failed: ' + e.toString());
				    	};
				    	console.log(self.previewStr);
				    	var blob = new Blob([self.previewStr], {type: 'text/plain'});
				    	fileWriter.write(blob);
				    }, function(err) {
						console.log(err)
					});
				}, function(err) {
					  console.log(err)
				});
			}, function(err) {
				console.log('window.requestFileSystem fail' + err);
			});
			
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