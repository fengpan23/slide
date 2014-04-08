define([],
function() {
	'use strict';
	var importer = {
		import: function(file, editorModel, next) {
			
			console.log(file.type);
			
			if (file.type === "application/vnd.ms-powerpoint") {
				var form = new FormData();
				var xhr = new XMLHttpRequest();
				
				form.append('file', file);
				xhr.open('POST', "ppt");
				xhr.setRequestHeader('Authorization', 'Client-ID ' + this.clientId);
				xhr.send(form);
			} else {
				next();
			}
		}
	};

	return {
		initialize: function(registry) {
			registry.register({
				interfaces: 'strut.importer'
			}, importer);
		}
	};
});