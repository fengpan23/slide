define(["./Menu", "lang"],function(Menu, lang) {
	function TableMenu(options) {
		var menulist = [{
			title: lang.setbgcolor,
			hander: this._setBgColor,
			model: options.model
		},{
			title: lang.insert_L,
			hander: this._insertL,
			model: options.model,
			flag: 0,
			$currenttarge: options.$target
		},{
			title: lang.insert_R,
			hander: this._insertL,
			model: options.model,
			flag: 1,
			$currenttarge: options.$target
		},{
			title: lang.insert_T,
			hander: this._insertR,
			model: options.model,
			flag: 0,
			$currenttarge: options.$target
		},{
			title: lang.insert_U,
			hander: this._insertR,
			model: options.model,
			flag: 1,
			$currenttarge: options.$target
		},{
			title: lang.delete_R,
			hander: this._deleteR,
			model: options.model,
			$currenttarge: options.$target
		},{
			title: lang.delete_L,
			hander: this._deleteL,
			model: options.model,
			$currenttarge: options.$target
		}];
		
		this.$el = $('<ul class="rightmenu"></ul>');
		options.model.bind('spectrum:hide', this._hideSpectrum, this);
		
		for(var li in menulist){
			this.$el.append(new Menu(menulist[li]));
		}
	}

	TableMenu.prototype = {
		render: function() {
			return this;
		},
		
		
		//TODO when click the adjust div how to get the correct current targe
		_deleteL: function(e) {
			var $table = $(this.model.get('table'));
			var indexL = this.$currenttarge.index();
			$table.find('tr').each(function() {
				$(this).children('td').eq(indexL).remove();
				return;
			});
			this.model.set('table', $table[0].outerHTML);
		},
		
		_deleteR: function(e) {
			var $table = $(this.model.get('table'))
			var indexR = this.$currenttarge.parent().index();
			$table[0].deleteRow(indexR);
//			var $table = $(this.model.get('table'))
//			var indexR = this.$currenttarge.parent().index();
//			$table.find('tr').each(function() {
//				if($(this).index() === indexR){
//					$(this).remove()
//				};
//			});
			this.model.set('table', $table[0].outerHTML);
		},
		
		_insertL: function() {
			var $table = $(this.model.get('table'));
			var indexL = this.$currenttarge.index();
			var self = this;
			$table.find('tr').each(function() {
				this.insertCell(indexL + self.flag);
			});
			this.model.set('table', $table[0].outerHTML);
		},
		
		_insertR: function() {
			var $table = $(this.model.get('table'));
			var indexR = this.$currenttarge.parent().index();
			if(this.$currenttarge.parent().is('tr')){
				var countCell = this.$currenttarge.parent()[0].childElementCount;
			}else{
				var countCell = $table.find('tr')[0].childElementCount;
//				indexR = ?; //when click the table adjust div inset tr where????
			};
			console.log(indexR);
			var tr = $table[0].insertRow(indexR + this.flag);
			for(var i=0; i < countCell; i++){
				tr.insertCell(i);
			}
			this.model.set('table', $table[0].outerHTML);
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
          			$('#rightColorPicker').show();
				},
          		move: function(color) {
          			self.model.set('background', color.toHexString());
          		}
			});
		},
		
		_hideSpectrum : function() {
			$('#rightColorPicker').hide();
		}
	};

	return TableMenu;
});