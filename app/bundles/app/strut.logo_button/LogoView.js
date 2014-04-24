define(['libs/backbone',
		'./LogoModel',
		'css!styles/logo_button/logo.css'],
function(Backbone, LogoModel) {
	'use strict';
	return Backbone.View.extend({
		className: 'logo-group btn-group',
		
		events: {
			'click': '_click'
		},
		
		initialize: function() {
			this._template = JST['strut.logo_button/Logo'];
			this.model = new LogoModel(this.options.editorModel);
			delete this.options.editorModel;
		},
		
		_click: function() {
			this.model._editorModel.slides().forEach(function(sl) {
				sl.get('components').forEach(function(comp) {
					comp.trigger("contentChange");
				});
			});
		},

		render: function() {
			this.$el.html(this._template());

			var $dropdown = this.$el.find('.dropdown-menu');
			this.model.items.forEach(function(item) {
				$dropdown.append(item.render().$el);
			}, this);

			return this;
		},

		constructor: function LogoView() {
			Backbone.View.prototype.constructor.apply(this, arguments);
		}
	});
});