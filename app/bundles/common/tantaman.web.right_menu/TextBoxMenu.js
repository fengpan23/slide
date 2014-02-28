define(["./Menu", "lang"],function(Menu, lang) {
	function TextBoxMenu(options) {
		var menulist = [{
			title: lang.setbgcolor,
			hander: this._setBgColor,
			model: options.model
		},{
			title: "add....",
			hander: this.add,
			model: options.model
		}];
		
		this.$el = $('<ul class="rightmenu"></ul>');
		options.model.bind('spectrum:hide', this._hideSpectrum, this);
		
		for(var li in menulist){
			this.$el.append(new Menu(menulist[li]));
		}
	}

	TextBoxMenu.prototype = {
		render: function() {
			return this;
		},
		_setBgColor: function() {
			var self = this;
			this.$menuColorPicker = $('#menuColorPicker');
			this.$menuColorPicker.spectrum({
          		showPalette: true,
          		palette: [],
			
				flat: true,
				showSelectionPalette: true,
          		localStorageKey: 'strut.colorChooser',
          		showInitial: true,
          		 showInput: true,
				chooseText: "Alright",
          		theme: 'sp-dark',
          		showButtons: true,
          		clickoutFiresChange: true,
          		beforeShow: function() {
          			$('#RightColorPicker').show();
				},
          		move: function(color) {
          			self.model.set('background', color.toHexString());
          		}
			});
		},
		
		_hideSpectrum : function() {
			$('#RightColorPicker').hide();
		},
		
		add: function() {
			console.log("add other");
		}
		
	};

	return TextBoxMenu;
});