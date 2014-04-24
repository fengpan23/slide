define(function() {
	function Menu(options) {
		this.$el = $('<li><a>' + options.title + '</a></li>');
		this.$el.click(function(e) {
			if(options.hander){
				options.hander(e);
			}else{
				return;
			}
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