define(['libs/backbone'],
function(Backbone) {
	return Backbone.View.extend({
		className: "rightMune hide",
		events: {
			'click': '_dispose',
			'click a[data-provider]': '_providerSelected',
			'mouseleave': 'timeDispose',
			'mouseenter': 'resetDispose',
		},

		initialize: function() {
			this.$el.html(JST['strut.right_menu/OperatingTableMenu']);
			$('#modals').append(this.$el);
		},

		show: function(event) {
			this.$el.css("z-index",5000);
			this.$el.css({
				position: 'absolute',
				top: event.clientY + "px",
				left: event.clientX + "px"
			});
			//this._setWidth(aUl[0]);
  
			//maxWidth = aDoc[0] - oMenu.offsetWidth;
			//maxHeight = aDoc[1] - oMenu.offsetHeight;
  
			//oMenu.offsetTop > maxHeight && (oMenu.style.top = maxHeight + "px");
			//oMenu.offsetLeft > maxWidth && (oMenu.style.left = maxWidth + "px");
			this._rightMeunSize();
			this.$el.show();
		},
		
		_displayArea: function() {
			var getOffset = {
					top: function (obj) {
						return obj.offsetTop + (obj.offsetParent ? arguments.callee(obj.offsetParent) : 0) 
					},
					left: function (obj) {
						return obj.offsetLeft + (obj.offsetParent ? arguments.callee(obj.offsetParent) : 0)
					}
				};
		},
		
		_rightMeunSize : function(){
			var temp = this.$el.width(); 
			var temp1 = this.$el.height();
			//var offsetWidth = this.$el.offsetWidth();
			//var offsetHeight = this.$eloffsetHeight();
//			maxWidth = 0;
//			for (i = 0; i < obj.children.length; i++){
//				var oLi = obj.children[i];   
//				var iWidth = oLi.clientWidth - parseInt(oLi.currentStyle ? oLi.currentStyle["paddingLeft"] : getComputedStyle(oLi,null)["paddingLeft"]) * 2
//				if (iWidth > maxWidth) maxWidth = iWidth;
//			}
//			for (i = 0; i < obj.children.length; i++) obj.children[i].style.width = maxWidth + "px";
		},
		
		timeDispose: function() {
			var self = this;
			this.timedispose = setTimeout(function(){
				self.dispose();
			},3000);
		},
		
		resetDispose: function() {
			clearTimeout(this.timedispose);
		},
		
		dispose: function() {
			this.$el.hide();
		},
		
		constructor: function OperatingTableMenuView() {
			Backbone.View.prototype.constructor.apply(this, arguments);
		}
	});
});