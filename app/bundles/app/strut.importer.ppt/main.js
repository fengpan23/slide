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
				xhr.onreadystatechange = function() {
          		  	if (xhr.readyState === 4) {
          		  		console.log(xhr.responseText);
          		  		if(xhr.responseText){
          		  			editorModel.importPresentation(JSON.parse(xhr.responseText));
          		  		}else{
          		  			alert('文件转换失败 ~~~！！！');
          		  		}
          		  	}else{
          		  		console.log('XMLHttp open error: ' + xhr.readyState);
          		  	}
				};
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