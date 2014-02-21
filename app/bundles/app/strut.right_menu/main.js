define(['./view/OperatingTableMenuView',
        './view/SlideWellMenuView'],
function(OperatingTableMenuView) {
	'use strict';
	
	var rigthmenu = {
		operatingTable: function($operatingTableArea){
			var Menu = new OperatingTableMenuView();
			document.oncontextmenu = function(e){
				return false;
			};
			$operatingTableArea.mousedown(function(e){
				if(3 == e.which){
					Menu.show(e);
				}else{
					Menu.dispose();
				}
			});
		},
		
		slideWell: function($slideWellArea){
			$slideWellArea.oncontextmenu = function (event){
				var event = event || window.event;
				SlideWellMenuView.show(event);
				return false;
			};
		}
	};
	
	return {
		initialize: function(registry) {
			registry.register({
				interfaces: 'strut.right_menu'
			}, rigthmenu);
		}	
	};
});