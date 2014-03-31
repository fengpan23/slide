/**
 * table width and height adjust
 * 
 * @author Pfeng
 */
define([ 'libs/backbone',
         './DeltaDragControl', 
         'strut/deck/ComponentCommands', 
         'tantaman/web/undo_support/CmdListFactory',
         'css!styles/widgets/tableAdjust.css' ], 
function(Backbone, DeltaDragControl, ComponentCommands, CmdListFactory) {
	'use strict';
	var undoHistory = CmdListFactory.managedInstance('editor');
	
	return Backbone.View.extend({
		className : 'tabEditDiv',

		events : {
			"deltadragStart .splity" : "splityStart",
			"deltadrag .splity" : "splity",
			"deltadragStop .splity" : "splityStop",
			"deltadragStart .splitx" : "splitxStart",
			"deltadrag .splitx" : "splitx",
			"deltadragStop .splitx" : "splitxStop"
		},

		initialize : function() {
			this.model = this.options.model;
			this.$component = this.options.$el;
			delete this.options;
			this._deltaDrags = [];
			this.render();
		},

		/**
		 * @param adjust div
		 */
		render : function() {
			var _this = this;
			this.$el.empty();
			this.table = this.$component.find('table')[0];
			this.loadTableEdit(this.table);
			this.$el.children("div").each(function(idx, elem) {
				var deltaDrag;
				deltaDrag = new DeltaDragControl($(elem), true);
				return _this._deltaDrags.push(deltaDrag);
			});
			return this.$component.append(this.$el);
		},

		/**
		 * Event: splity transformation started.
		 */
		splityStart : function(e) {
			this.drag = true;
			this._initTable = this.model.get('table');
			this._tableWidth = this.model.get('width');
			var currentId = parseInt(e.target.id.split("_")[1]);
			var divs = this.$el.find('.splity');
			this.index = 0;
			if(currentId === 0){
				console.log(divs);
				return this._initialWidth = parseInt(divs[1].id.split("_")[1]);
			}
			for ( var k = 0; k < divs.length; k++) {
				if (parseInt(divs[k].id.split("_")[1]) < currentId){
					this.index += 1;
					continue;
				}
				return this._initialWidth = currentId - parseInt(divs[k-1].id.split("_")[1]);
			}
		},

		/**
		 * Event: splity transformation is in progress.
		 * 
		 * @param {Event}  e
		 * @param {{dx:number, dy: number}} deltas
		 */
		splity : function(e, deltas) {
			var currentWidth = this._initialWidth + deltas.dx;
			if(this.index !== 0){
				for ( var i = 0; i < this.table.rows.length - 1; i++) {
					if (!this.table.rows[i].cells[this.index] || this.index < 0 || this.table.rows[i].cells[this.index].colSpan > 1) {
						continue;
					}
					this.table.rows[i].cells[this.index - 1].style.width = currentWidth + "px";
//					console.log(this.index - 1);
//					console.log(this.table.rows[i].cells[this.index - 1].style.width);
				}
			}else{
				for ( var i = 0; i < this.table.rows.length - 1; i++) {
					if (!this.table.rows[i].cells[this.index] || this.index < 0 || this.table.rows[i].cells[this.index].colSpan > 1) {
						continue;
					}
					this.table.rows[i].cells[this.index].style.width = currentWidth + "px";
				}
			}
			$(this.table).attr('width', this._tableWidth + deltas.dx);
			this.model.set('width', this._tableWidth + deltas.dx);
		},

		/**
		 * Event: splity transformation stopped.
		 */
		splityStop : function() {
			this.drag = false;
			this.model.set('table', this.table.outerHTML);
			this.render();
			var cmd = new ComponentCommands.TableAdjust({'table': this._initTable, 'width': this._tableWidth}, this.model);
			undoHistory.push(cmd);
		},
		
		/**
		 * Event: splitx transformation started.
		 */
		splitxStart : function(e) {
			this.drag = true;
			this._initTable = this.model.get('table')
			this._tableHeight = this.model.get('height') || this.table.clientHeight;
			var currentId = parseInt(e.target.id.split("_")[1]);
			var divs = this.$el.find('.splitx');
			this.index = 0;
			if(currentId === 0){
				return this._initialHeight = parseInt(divs[1].id.split("_")[1]);
			}
			for ( var k = 0; k < divs.length; k++) {
				if (parseInt(divs[k].id.split("_")[1]) < currentId){
					this.index += 1;
					continue;
				}
				return this._initialHeight = currentId - parseInt(divs[k-1].id.split("_")[1]);
			}
		},

		/**
		 * Event: splitx transformation is in progress.
		 * 
		 * @param {Event}
		 *            e
		 * @param {{dx:
		 *            number, dy: number}} deltas
		 */
		splitx : function(e, deltas) {
			var currentHeight = this._initialHeight + deltas.dy;
			if(this.index !== 0){
				for ( var i = 0; i < this.table.rows[this.index - 1].cells.length - 1; i++) {
					if (!this.table.rows[this.index - 1] || this.index < 0 || this.table.rows[this.index - 1].cells[i].rowSpan > 1) {
						continue;
					}
					this.table.rows[this.index - 1].cells[i].style.height = currentHeight + "px";
				}
			}else{
				for ( var i = 0; i < this.table.rows[0].cells.length - 1; i++) {
					if (!this.table.rows[0].cells[i] || this.index < 0 || this.table.rows[0].cells[i].rowSpan > 1) {
						continue;
					}
					this.table.rows[0].cells[i].style.height = currentHeight + "px";
				}
			}
			$(this.table).attr("height",this._tableHeight + deltas.dy);
			this.model.set('height', this._tableHeight + deltas.dy);
		},

		/**
		 * Event: splitx transformation stopped.
		 */
		splitxStop : function() {
			this.drag = false;
			this.model.set('table', this.table.outerHTML);
			this.render();
			var cmd = new ComponentCommands.TableAdjust({'table': this._initTable, 'height': this._tableHeight}, this.model);
			undoHistory.push(cmd);
		},

		/**
		 * @param load edit div table
		 * 
		 * return $editDiv
		 */
		loadTableEdit : function(table) {
			this.$el.empty();
			for ( var i = 0; i < table.rows.length; i++) {
				if (!this.$el.find("#splitx_"
						+ table.rows[i].cells[0].offsetTop)[0]) {
					var split = document.createElement("div");
					split.id = "splitx_" + table.rows[i].cells[0].offsetTop;
					split.className = "splitx";
					split.style.cssText = "width:" + table.clientWidth
							+ "px;top:" + table.rows[i].cells[0].offsetTop
							+ "px";
					this.$el.append(split);
				}
			}
			for ( var j = 0; j < table.rows[0].cells.length; j++) {
				if (!this.$el.find("#splity_"
						+ table.rows[0].cells[j].offsetLeft)[0]) {
					var split = document.createElement("div");
					split.id = "splity_" + table.rows[0].cells[j].offsetLeft;
					split.className = "splity";
					split.style.cssText = "height:" + table.clientHeight
							+ "px;top:1px;left:"
							+ table.rows[0].cells[j].offsetLeft + "px";
					this.$el.append(split);
				}
			}
			if (!this.$el.find("#splitx_" + table.clientHeight)[0]) {
				var split = document.createElement("div");
				split.id = "splitx_" + table.clientHeight;
				split.className = "splitx";
				split.style.cssText = "width:" + table.clientWidth + "px;top:"
						+ table.clientHeight + "px";
				this.$el.append(split);
			}
			if (!this.$el.find("#splity_" + table.clientWidth)[0]) {
				var split = document.createElement("div");
				split.id = "splity_" + table.clientWidth;
				split.className = "splity";
				split.style.cssText = "height:" + table.clientHeight
						+ "px;top:1px;left:" + table.clientWidth + "px";
				this.$el.append(split);
			}
			return this.$el;
		},

		dispose : function() {
			var deltaDrag, idx, _ref;
			Backbone.View.prototype.remove.call(this);
			_ref = this._deltaDrags;
			for (idx in _ref) {
				deltaDrag = _ref[idx];
				deltaDrag.dispose();
			}
			this.$el.remove();
		},

		constructor : function TableAdjust() {
			Backbone.View.prototype.constructor.apply(this, arguments);
		}
	});
});