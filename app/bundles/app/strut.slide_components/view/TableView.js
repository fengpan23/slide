define(["./ComponentView", "libs/etch",
	"strut/deck/ComponentCommands",
	"tantaman/web/widgets/TableAdjust",
	"tantaman/web/undo_support/CmdListFactory",
	"tantaman/web/interactions/TouchBridge",
	"tantaman/web/widgets/RightMenu",],
	function(ComponentView, etch, ComponentCommands, TableAdjust, CmdListFactory, TouchBridge, RightMenu) {
		'use strict';
		var undoHistory = CmdListFactory.managedInstance('editor');
		var styles;
		styles = ["weight", "style", "color", "decoration", "align"];

		/**
		 * @class TextBoxView
		 * @augments ComponentView
		 */
		return ComponentView.extend({
			className: "component tableXm",
			tagName: "div",

			/**
			 * Returns list of events, tracked by this view.
			 *
			 * @returns {Object}
			 */
			events: function() {
				var myEvents, parentEvents;
				parentEvents = ComponentView.prototype.events();
				myEvents = {
					"editComplete": "editCompleted",
					"mouseenter": "tableAdjustInit",
					"mouseleave": "tableAdjustDispose",
					"mouseout table td": "mouseleave",
					"mouseover table td": "mouseleave"
				};
				return _.extend(parentEvents, myEvents);
			},

			/**
			 * Initialize TextBox component view.
			 */
			initialize: function() {
				var style, _i, _len;
				ComponentView.prototype.initialize.apply(this, arguments);
				for (_i = 0, _len = styles.length; _i < _len; _i++) {
					style = styles[_i];
					this.model.on("change:" + style, this._styleChanged, this);
				}
				this.model.on("change:table", this._tableChanged, this);
				this.model.on("change:background", this._backgroundChanged, this);
				
				this._lastDx = 0;
				this.keydown = this.keydown.bind(this);
				
				this._rightMenu = this._rightMenu.bind(this);
				this.$el.on("contextmenu", this._rightMenu);
				
				this.dblclicked = this.dblclicked.bind(this);
				TouchBridge.on.dblclick(this.$el, this.dblclicked);

				// TODO This can be uncommented once modal windows start blocking all slide key events.
				// https://github.com/tantaman/Strut/pull/183
				// $(document).bind("keydown", this.keydown);

				this.model.on("edit", this.edit, this);
			},
			
			/**
			 * right menu function option
			 * @param nothing
			 * @private
			 */
			_rightMenu: function(e) {
				var menu = new RightMenu({model: this.model});
				if(menu){
					menu.render($(e.target));
					menu.show(e);
					return false;
				}else{
					return ture;
				}
			},
			
			tableAdjustInit: function(){
				if(!this.tableEdit){
					console.time('tableAdjust');
					this.tableAdjust = new TableAdjust({
						$el: this.$el,
						model: this.model
					});
					console.timeEnd('tableAdjust');
					this.tableEdit = true;
				}
			},
			
			tableAdjustDispose: function(){
				if(!this.tableAdjust.drag){
					this.tableAdjust.dispose();
					this.tableEdit = false;
				}else{
					this.dispose = true;
				}
			},
			
			_backgroundChanged: function() {
				this.$content.find('table').css('background', this.model.get('background'));
			},
			
			/**
			 * Event: scale started.
			 */
			scaleStart: function() {
				this._initialSize = this.model.get('size');
			},

			/**
			 * Event: scale in progress.
			 *
			 * @param {Event} e
			 * @param {{dx: number, dy: number}} deltas
			 */
			scale: function(e, deltas) {
				var currSize, sign;
				currSize = this.model.get("size");
				if(!currSize){
					currSize = this.$el.css("font-size").replace("px",'');
				}
				sign = deltas.dx - this._lastDx > 0 ? 1 : -1;
				this._increment = Math.round(sign * Math.sqrt(Math.abs(deltas.dx - this._lastDx)));
				this.model.set("size", this._increment + parseInt(currSize));
				return this._lastDx = deltas.dx;
			},

			/**
			 * Event: scale stopped.
			 */
			scaleStop: function() {
				var cmd = ComponentCommands.TextScale(this._initialSize, this.model);
				undoHistory.push(cmd);
				this.editCompleted();
			},
			
			/**
			 * TODO table width and height adjust
			 */
			mouseleave: function(){
				var temp =1;
			},

			/**
			 * Remove component view.
			 *
			 * @param {boolean} disposeModel Whether or not to dispose component's model as well.
			 */
			remove: function(disposeModel) {
				ComponentView.prototype.remove.apply(this, arguments);
				// TODO This can be uncommented once modal windows start blocking all slide key events.
				// $(document).unbind("keydown", this.keydown);
			},

			/**
			 * Event: element is double clicked. Enter editing mode for a textbox.
			 *
			 * @param {Event} e
			 */
			dblclicked: function(e) {
				this.$el.addClass("editable");
				this.$content.find('table').attr("contenteditable", true);
				if (e != null) {
					this._initialText = this.$content.html();
					etch.editableInit.call(this, e, this.model.get("y") * this.dragScale + 35);

					if (!this.editing) {
//						TODO: The page elements get focus  Unlike input
						this.$content.find('tr').find('td').get(0).focus();
						try {
							etch.triggerCaret();
						} catch (e) {
							// firefox failboats on this command
							// for some reason.  hence the try/catch
							 console.log(e);
						}
					}
				}
				this.allowDragging = false;
				this.editing = true;
			},

			/**
			 * Event: mouse button has peen pressed down, drag started. If in editing mode, move etch to the clicked spot.
			 *
			 * @param {Event} e
			 */
			mousedown: function(e) {
				if (this.editing) {
					e.stopPropagation();
					etch.editableInit.call(this, e, this.model.get("y") * this.dragScale + 35);
				} else {
					ComponentView.prototype.mousedown.apply(this, arguments);
				}
				return true;
			},

			// TODO Add doc (Why do we need to call trigger caret?)
			/**
			 * Event: mouse button has been released.
			 *
			 * @param {Event} e
			 */
			mouseup: function(e) {
				if (this.editing) {
					etch.triggerCaret();
					//etch.editableInit.call(this, e, this.model.get("y") * this.dragScale + 35);
				}
				if(this.dispose){
					this.tableAdjust.dispose();
					this.tableEdit = false;
					delete this.dispose;
				}
				ComponentView.prototype.mouseup.apply(this, arguments);
			},

			/**
			 * Event: key has been pressed down. If textbox is in focus, and it was a charachter key pressed, then start
			 * typing in the textbox.
			 *
			 * @param {Event} e
			 */
			keydown: function(e) {
				// When user starts typing text in selected textbox, open edit mode immediately.
				if (this.model.get("selected") && !this.editing) {
					if (!e.ctrlKey && !e.altKey && !e.metaKey && String.fromCharCode(e.which).match(/[\w]/)) {
						this.edit();
					}
				}
			},

			/**
			 * Open editor for the textbox.
			 */
			edit: function() {
				var e;
				this.model.set("selected", true);
				e = $.Event("click", {
					pageX: this.model.get("x")
				});
				this.dblclicked(e);
				this.$content.selectText();
			},

			/**
			 * Finish editing and close the editor.
			 */
			editCompleted: function() {
				var text;
				text = this.$content.html();
				this.editing = false;
				if (text === "" || $(text).find('td').length < 1) {
					return this.remove();
				} else {
					var cmd = ComponentCommands.Text(this._initialText, this.model);
					undoHistory.push(cmd);

					this.model.set("table", text);
					window.getSelection().removeAllRanges();
					this.$content.attr("contenteditable", false);
					this.$el.removeClass("editable");
					this.allowDragging = true;
				}
			},

			/**
			 * React on component is being selected. If component have been unselected, hide it's editor, if in editing mode.
			 *
			 * @param {Component} model
			 * @param {boolean} selected
			 * @private
			 */
			_selectionChanged: function(model, selected) {
				ComponentView.prototype._selectionChanged.apply(this, arguments);
				if (!selected && this.editing) {
					this.editCompleted();
				}
			},

			/**
			 * React on component style change. Update CSS classes of the element.
			 *
			 * @param {Component} model
			 * @param {string} style
			 * @param {Object} opts
			 * @private
			 */
			_styleChanged: function(model, style, opts) {
				var key, value, _ref, _results;
				_ref = opts.changes; //model.changed;
				if (!_ref) return;
				for (var i = 0; i < _ref.length; ++i) {
					key = _ref[i];
					value = model.get(key);
					if (value) {
						if (key === "decoration" || key === "align") {
							key = "text" + key.substring(0, 1).toUpperCase() + key.substr(1);
						} else if (key === "size") {
							//var selectedtext = this._getSelectedText();
							key = "font" + key.substr(0, 1).toUpperCase() + key.substr(1);
							var _this = this;
							$("font,span", $(".content", this.$el)).each(function(i,n){
								var currentsize =  $(n).css("font-size");
								var temp= currentsize.substring(0, currentsize.length-2);
								$(n).css("font-size", parseInt(temp) + _this._increment);
							});
						}
						//this.$el.css(key, style);
					}
				}
			},
			
			/**
			 * React on component's text change. Update html contents of the text box.
			 *
			 * @param {Component} model
			 * @param {string} text Updated text (HTML code).
			 * @private
			 */
			_tableChanged: function(model, table) {
				if($(table).find('td').length < 1 || $(table).find('tr').length < 1){
					return this.remove();
				}
				this.$content.html(table);
			},

			_handlePaste: function(elem, e) {
				e = e.originalEvent;
				document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
				// var sel = window.getSelection();
				// var range = sel.getRangeAt(0);
				// var text = document.createTextNode(e.clipboardData.getData('text/plain'));
				// range.deleteContents();
				// range.insertNode(text);

				// range.setStartAfter(text);
				// range.setEndAfter(text);

				// sel.removeAllRanges();
				// sel.addRange(range);
				
				e.preventDefault();
			},
			
			/**
			 * Render element based on component model.
			 *
			 * @returns {*}
			 */
			render: function() {
				ComponentView.prototype.render.call(this);
				this.$el.find("span[data-delta='scale']").hide()
				this.$content = this.$el.find(".content");
				this.$content.css({'height': '100%', 'width': '100%'});  
				var self = this;
				this.$content.bind('paste', function(e) {
					self._handlePaste(this, e);
				});
				this.$content.html(this.model.get("table"));
				
				//$('.rightLabel', this.$content.parent().parent()).show();
				this.$el.css({
					// color: "#" + this.model.get("color"),
					top: this.model.get("y"),
					left: this.model.get("x"),
					// textAlign: this.model.get("align")
				});
				return this.$el;
			},

			constructor: function TableView() {
				ComponentView.prototype.constructor.apply(this, arguments);
			}
		});
	});