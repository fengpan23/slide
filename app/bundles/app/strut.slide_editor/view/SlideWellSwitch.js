define(['libs/backbone'],
function(Backbone) {
	return Backbone.View.extend({
		className: 'slideWellSwitch hidden-phone',
		events: {
			click: "_switchSlideWell"
		},

		_switchSlideWell: function() {
			if(this.slideWell.$el.is(":hidden")){
				this.slideWell.$el.show(1000);
				this.$el.animate({left: "135px"}, 1000, function() {
					$(this).find("i").removeClass("icon-chevron-right").addClass("icon-chevron-left");
					$(window).resize();
				});
			}else{
				this.slideWell.$el.hide(1000);
				this.$el.animate({left: "0px"}, 1000, function() {
					$(this).find("i").removeClass("icon-chevron-left").addClass("icon-chevron-right");
					$(window).resize();
				});
			}
		},

		render: function() {
			this.$el.html(JST['strut.slide_editor/Switch']);
			return this;
		},

		constructor: function SlideWellSwitch(slideWell) {
			this.slideWell = slideWell;
			Backbone.View.prototype.constructor.call(this);
		}
	});
});
