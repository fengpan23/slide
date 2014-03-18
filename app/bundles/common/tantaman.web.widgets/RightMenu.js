define([ 'libs/backbone',
         "tantaman/web/right_menu/TextBoxMenu",
         "tantaman/web/right_menu/TableMenu",
         'css!styles/widgets/rightMenu.css' ], 
function(Backbone, TextBoxMenu,	TableMenu, empty) {
	return Backbone.View.extend({
		className : "rightMenuModal hide",
		events : {
			'click' : 'dispose',
			'mouseleave' : 'timeDispose',
			'mouseenter' : 'resetDispose',
		},

		initialize : function() {
			if($('#modals').find('.rightMenuModal').size() > 0){
				this.$el = $('#modals').find('.rightMenuModal');
				return;
			}
			this.model = this.options.model;
			delete this.options;
			$('#modals').append(this.$el);
			this.$el.html(JST['tantaman.web.widgets/RightMenu']);
		},

		/**
		 */
		render : function($target) {
			this.$el.find("#rightMenu").empty();
			var menuType = this.model.get('type');
			if(menuType=== 'TextBox') {
				var menuItem = new TextBoxMenu({
					model : this.model
				});
			}else if(menuType=== 'Table'){
				var menuItem = new TableMenu({
					model : this.model,
					$target : $target
				});
			}
			this.$el.find("#rightMenu").append(menuItem.render().$el);
		},

		show : function(event) {
			this.$el.show();
			this.$el.find('#rightMenu').show();
			this.$el.css("z-index", 5000);
			this.$el.css({
				position : 'absolute',
				top : event.clientY + "px",
				left : event.clientX + "px"
			});
			this._displayArea(event);
			var _this = this;
			$('body').bind('mousedown #rightMenu', function(e) {
				var target = e.target || e.srcElement;
				if ($(target).not('.rightColorPicker *, #rightMenu *, .sp-container *, .lineSpacing *').size()) {
					_this.model.trigger('spectrum:hide', null);
					_this.model.trigger('lineSpacing:hide', null);
					_this.dispose();
					$(this).unbind('mousedown #rightMenu');
				}
			});
		},
		
		/**
		 * correct display position
		 * @param current event    get the current mouse position
		 */
		_displayArea : function(e) {
			var pos = {top: e.clientY, left: e.clientX};
			if(($('body').width() - e.clientX) < this.$el.get(0).scrollWidth){
				pos.left = e.clientX - this.$el.get(0).scrollWidth;	
			}
			if(($('body').height() - e.clientY) < this.$el.get(0).scrollHeight){
				pos.top = e.clientY - this.$el.get(0).scrollHeight;	
			}
			this.$el.css({
				top : pos.top + "px",
				left : pos.left + "px"
			});
		},

		timeDispose : function() {
			var self = this;
			this.timedispose = setTimeout(function() {
				self.dispose();
			}, 3000);
		},

		resetDispose : function() {
			clearTimeout(this.timedispose);
		},

		dispose : function() {
			this.$el.find('#rightMenu').hide();
		},

		constructor : function RightMenu() {
			Backbone.View.prototype.constructor.apply(this, arguments);
		}
	});
});