define(["./Menu",
	 	"strut/deck/ComponentCommands",
    	"tantaman/web/undo_support/CmdListFactory",
    	"lang"],function(Menu, ComponentCommands, CmdListFactory, lang) {
var undoHistory = CmdListFactory.managedInstance('editor');
	function TableMenu(options) {
		var menulist = [{
			title: lang.setbgcolor
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
		
		var colorlist = [{
				title: lang.cell_color,
				hander: this._setBgColor,
				model: options.model,
				$currenttarge: options.$target
			},{
				title: lang.line_color,
				hander: this._setBgColor,
				model: options.model,
				$currenttarge: options.$target
			},{
				title: lang.row_color,
				hander: this._setBgColor,
				model: options.model,
				$currenttarge: options.$target
			},{
				title: lang.table_color,
				hander: this._setBgColor,
				model: options.model,
				$currenttarge: options.$target
			},{
				title: lang.t_color_reset,
				hander: this._resetBg,
				model: options.model,
				$currenttarge: options.$target
			}];
		
		this.$el = $('<ul class="rightmenu"></ul>');
		options.model.bind('spectrum:hide', this._hideSpectrum, this);
		
		for(var li in menulist){
			this.$el.append(new Menu(menulist[li]));
		}
		var $colorList = $('<ul class="dropdown-menu"></ul>');
		
		for(var li in colorlist){
			$colorList.append(new Menu(colorlist[li]));
		}
		
		this.$el.find("li:contains(" + lang.setbgcolor + ")").addClass('dropdown-submenu').append($colorList);
	}

	TableMenu.prototype = {
		render: function() {
			return this;
		},
		
		
		//TODO when click the adjust div how to get the correct current targe
		_deleteL: function(e) {
			var $table = $(table);
			var indexL = this.$currenttarge.index();
			$table.find('tr').each(function() {
				$(this).children('td').eq(indexL).remove();
				return;
			});
			this.model.set('table', $table[0].outerHTML);
			var cmd = ComponentCommands.TableText(table, this.model);
			undoHistory.push(cmd);
		},
		
		_deleteR: function(e) {
			var $table = $(table)
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
			var cmd = ComponentCommands.TableText(table, this.model);
			undoHistory.push(cmd);
		},
		
		_insertL: function() {
			var table = this.model.get('table');
			var $table = $(table);
			var indexL = this.$currenttarge.index();
			var self = this;
			$table.find('tr').each(function() {
				this.insertCell(indexL + self.flag);
			});
			this.model.set('table', $table[0].outerHTML);
			var cmd = ComponentCommands.TableText(table, this.model);
			undoHistory.push(cmd);
		},
		
		_insertR: function() {
			var table = this.model.get('table');
			var $table = $(table);
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
			var cmd = ComponentCommands.TableText(table, this.model);
			undoHistory.push(cmd);
		},
		
		_resetBg: function() {
			var table = this.model.get('table');
			this.model.set('table', table.replace(/style="[^"]*"/g, ""));
			var cmd = ComponentCommands.TableText(table, this.model);
			undoHistory.push(cmd);
		},
		
		_setBgColor: function() {
			var table = this.model.get('table');
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
          			var row = self.$currenttarge.parent().index() || 0;
          			var line = self.$currenttarge.index() || 0;
//          			console.log(self.$currenttarge.parent().index()); //row
//          			console.log(self.$currenttarge.index()); //line 
          			var $table = $(self.model.get('table'));
          			
          			if(self.title === lang.row_color){
          				$table.find('tr:eq('+ row +')').css('background', color.toHexString());
          			}else if(self.title === lang.line_color){
          				$table.find('tr').find('td:eq('+ line +')').each(function() {
							$(this).css('background', color.toHexString());
						});
          			}else if(self.title === lang.cell_color){
          				$table.find('tr:eq('+ row +')').find('td:eq('+ line +')').css('background', color.toHexString());
          			}else if(self.title === lang.table_color){
          				$table.css('background', color.toHexString());
          			}else{
          				alert('error');
          				return;
          			}
          			self.model.set('table', $table[0].outerHTML);
          			var cmd = ComponentCommands.TableText(table, self.model);
        			undoHistory.push(cmd);
          		}
			});
		},
		
		_hideSpectrum : function() {
			$('#rightColorPicker').hide();
		}
	};

	return TableMenu;
});