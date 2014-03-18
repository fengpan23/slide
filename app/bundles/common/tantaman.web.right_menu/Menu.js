define(function() {
	function Menu(options) {
		this.$el = $('<li><a>' + options.title + '</a></li>');
		this.$el.click(function(e) {
			options.hander(e);
		});
		
		return this.$el;
	}

	Menu.prototype = {
		render: function() {
			return this;
		}
	};

	return Menu;
});