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
				this.set('type', 'Image');
				var src = this.get('src');
				this.set('imageType', FileUtils.imageType(src));
				this.uri = src;
			},

			dispose: function() {
				Component.prototype.dispose.apply(this, arguments);
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