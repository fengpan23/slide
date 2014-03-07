define(['strut/deck/Component',
	'common/FileUtils'],
	function(Component, FileUtils) {
		'use strict';

		/**
		 * @class Image
		 * @augments Component
		 */
		return Component.extend({
			// TODO: what about when this component is restored from undo?
			// object urls... would have been revoked...
			initialize: function() {
				Component.prototype.initialize.apply(this, arguments);
				this.registry = window.serviceRegistry;
				this.set('type', 'Image');
				var src = this.get('src');
				var self = this;
				this.storageInterface = this.registry.getBest('strut.StorageInterface');
				if (typeof src === 'object') {
					this.set('imageType', ''); // TODO
					this.storageInterface.getAttachmentURL(src.docKey, src.attachKey)
					.then(function(uri) {
						self.uri = uri;
						self.trigger('change:uri', self, uri);
						self.trigger('change', self);
					}, function(err) {
						console.error(err);
					}).done();
				} else if(typeof src === 'string' && src.indexOf('base64,') > 11){
					this.uri = src;
				}else {
					this.set('imageType', FileUtils.imageType(src));
					var imgname = src.split('/')
					this.storageInterface.getAttachmentURL(imgname[imgname.length - 2], imgname[imgname.length - 1])
					.then(function(uri) {
						self.uri = uri;
						self.trigger('change:uri', self, uri);
						self.trigger('change', self);
					}, function(err) {
						console.error(err);
					}).done();
//					this.uri = src;
				}
			},

			dispose: function() {
				Component.prototype.dispose.apply(this, arguments);
				var src = this.get('src');
				if (typeof src === 'object') {
					console.log('Revoking image uri');
					this.storageInterface
					.revokeAttachmentURL(src.docKey, src.attachKey);
				}
			},

			getURL: function() {
				return this.uri;
			},

			// TODO: need to implement clone to correctly handle
			// the url and other transient attributes.

			constructor: function ImageModel(attrs) {
				Component.prototype.constructor.call(this, attrs);
			}
		});
	});