define(["./Menu",
        "strut/deck/ComponentCommands",
    	"tantaman/web/undo_support/CmdListFactory",
    	"lang"],function(Menu, ComponentCommands, CmdListFactory, lang) {
	var undoHistory = CmdListFactory.managedInstance('editor');
	function TextBoxMenu(options) {
		var menulist = [{
			title: lang.setbgcolor,
			hander: this._setBgColor,
			model: options.model
		},{
			title: lang.setLineSpacing,
			hander: this._setLineSpacing,
			model: options.model
		},{
			title: lang.bgOpacity,
			hander: this._adjustOpacity,
			model: options.model
		}];
		
		this.$el = $('<ul class="rightmenu"></ul>');
		options.model.bind('spectrum:hide', this._hideSpectrum, this);
		options.model.bind('lineSpacing:hide', this._hideLineSpacing, this);
		options.model.bind('adjustOpacity:hide', this._hideAdjustOpacity, this);
		
		for(var li in menulist){
			this.$el.append(new Menu(menulist[li]));
		}
	}

	TextBoxMenu.prototype = {
		render: function() {
			return this;
		},
		
		_adjustOpacity: function() {
			var initOpacity = this.model.get('opacity') || 1;
			 console.log("init value: " + initOpacity);
			var self = this;
		    $( "#slider-range-min" ).slider({
			      range: "min",
			      value: initOpacity * 100,
			      min: 1,
			      max: 100,
			      slide: function(event, ui ) {
			    	  //opacity: 0.4
			    	  console.log("slide value: " + ui.value);
			    	  $( "#amount" ).val(ui.value + "%");
			    	  self.model.set('opacity', ui.value/100);
			      },
			      change: function(event, ui) {
			    	  console.log("change value: " + ui.value);
			    	  
			    	  self.model.set('opacity', ui.value/100);
			    	  var cmd = ComponentCommands.Opacity(initOpacity, self.model);
			    	  undoHistory.push(cmd);
			      }
		    });
		    $( "#amount" ).val($( "#slider-range-min" ).slider( "value" ) + "%");
			$('.adjustOpacity').show();
		},
		
		_hideAdjustOpacity: function() {
			if(!$('.adjustOpacity').is(":hidden")){
				$("#slider-range-min").slider("destroy");
				$('.adjustOpacity').hide();
			}
		},
		
		_setLineSpacing: function() {
			var self = this;
			var initLineSpacing = this.model.get('lineSpacing')
			$('.lineSpacing').show();
			$('.lineSpacing').find('a').each(function() {
				$(this).off('click').on('click', function(e) {
					log(parseFloat(e.currentTarget.innerHTML));
					self.model.set('lineSpacing', e.currentTarget.innerHTML === 'normal' ? 'normal' : parseFloat(e.currentTarget.innerHTML));
					var cmd = ComponentCommands.LineSpaceing(initLineSpacing, self.model);
					undoHistory.push(cmd);
				});
			});
		},
		
		_hideLineSpacing: function() {
			$('.lineSpacing').hide();
		},
		
		_setBgColor: function() {
			var self = this;
			var initialBackground = this.model.get('background');
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
          			$('#rightColorPicker').show();
				},
          		move: function(color) {
          			self.model.set('background', color.toHexString());
          			var cmd = ComponentCommands.Background(initialBackground, self.model);
        			undoHistory.push(cmd);
          		}
			});
		},
		
		_hideSpectrum : function() {
			$('#rightColorPicker').hide();
		}
	};

	return TextBoxMenu;
});