define(['libs/backbone', '../model/ActionHandlers', 'tantaman/web/widgets/ErrorModal', 'lang'],
function(Backbone, ActionHandlers, ErrorModal, lang) {
	return Backbone.View.extend({
		tagName: 'li',
		events: {
			click: 'save'
		},

		constructor: function SaveMenuItem(modal, model, storageInterface) {
			Backbone.View.prototype.constructor.call(this);
			this.model = model;
			this.saveAsModal = modal;
			this.storageInterface = storageInterface;
		},

		save: function() {
			this.storageInterface.selectProvider("remotestorage");
			var fileName = this.model.fileName();
			if (fileName == null || fileName.length < 1) {
				this.saveAsModal.show(ActionHandlers.save, lang.save_as);
			} else {
//				this.model._manualSaver.save();
				ActionHandlers.save(this.storageInterface, this.model, fileName, ErrorModal.show);
			}
		},

		render: function() {
			this.$el.html('<a>' + lang.save + '</a>');
			return this;
		}
	});
});