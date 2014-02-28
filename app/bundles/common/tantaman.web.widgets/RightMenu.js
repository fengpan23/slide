define([ 'libs/backbone', "tantaman/web/right_menu/TextBoxMenu",
		'css!styles/widgets/rightMenu.css' ], function(Backbone, TextBoxMenu,
		empty) {
	return Backbone.View.extend({
		className : "rightMenu hide",
		events : {
			'click' : 'dispose',
			'mouseleave' : 'timeDispose',
			'mouseenter' : 'resetDispose',
		},

		initialize : function() {
			this.model = this.options.model;
			delete this.options;
			$('#modals').append(this.$el);
			this.$el.html(JST['tantaman.web.widgets/RightMenu']);
			this.render();
		},

		/**
		 */
		render : function() {
			if (this.model.get('type') === 'TextBox') {
				var menuItem = new TextBoxMenu({
					model : this.model
				});
			}
			this.$el.find("#RightMenu").append(menuItem.render().$el);
		},

		show : function(event) {
			this.$el.css("z-index", 5000);
			this.$el.css({
				position : 'absolute',
				top : event.clientY + "px",
				left : event.clientX + "px"
			});
			// this._setWidth(aUl[0]);

			// maxWidth = aDoc[0] - oMenu.offsetWidth;
			// maxHeight = aDoc[1] - oMenu.offsetHeight;

			// oMenu.offsetTop > maxHeight && (oMenu.style.top = maxHeight +
			// "px");
			// oMenu.offsetLeft > maxWidth && (oMenu.style.left = maxWidth +
			// "px");
			var _this = this;
			$('body').bind('mousedown.rightMenu', function(e) {
				var target = e.target || e.srcElement;
				if ($(target).not('.RightColorPicker *, #RightMenu *, .sp-container *').size()) {
					_this.model.trigger('spectrum:hide', null);
					_this.dispose();
					$(this).unbind('mousedown.rightMenu');
				}
			});
//			this._rightMeunSize();
			this.$el.show();
			this.$el.find('#RightMenu').show();
		},

		_displayArea : function() {
			var getOffset = {
				top : function(obj) {
					return obj.offsetTop
							+ (obj.offsetParent ? arguments
									.callee(obj.offsetParent) : 0)
				},
				left : function(obj) {
					return obj.offsetLeft
							+ (obj.offsetParent ? arguments
									.callee(obj.offsetParent) : 0)
				}
			};
		},

		_rightMeunSize : function() {
			var temp = this.$el.width();
			var temp1 = this.$el.height();
			// var offsetWidth = this.$el.offsetWidth();
			// var offsetHeight = this.$eloffsetHeight();
			// maxWidth = 0;
			// for (i = 0; i < obj.children.length; i++){
			// var oLi = obj.children[i];
			// var iWidth = oLi.clientWidth - parseInt(oLi.currentStyle ?
			// oLi.currentStyle["paddingLeft"] :
			// getComputedStyle(oLi,null)["paddingLeft"]) * 2
			// if (iWidth > maxWidth) maxWidth = iWidth;
			// }
			// for (i = 0; i < obj.children.length; i++)
			// obj.children[i].style.width = maxWidth + "px";
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
			this.$el.find('#RightMenu').hide();
		},

		constructor : function RightMenu() {
			Backbone.View.prototype.constructor.apply(this, arguments);
		}
	});
});