define(['strut/deck/Component'],
	function(Component) {
		'use strict';

		function getInitialTable(attrs) {
			if (!attrs)
				//TODO default table
				return '<table border="1" height="180px" width="300px" ><tbody><tr><td></td><td></td></tr><tr><td></td><td></td></tr></tbody></table>';
			else {
				var text = '<table>';
				for (var row in attrs.row) {
					text += '<tr>';
					for(var line in attrs.line){
						text += '<td>Input Text</td>';
					}
					text += '</tr>';
				}
				return text + '</table>';
			}
		}

		/**
		 * @class Table
		 * @augments Component
		 */
		return Component.extend({
			initialize: function() {
				Component.prototype.initialize.apply(this, arguments);
				this.set('type', 'Table');
				if (!this.get('table')) {
					var table = getInitialTable(this._opts);
					this.set('table', table);
					if (!this.get('width')){
						this.set('width', 300);
					}
				}
			},

			constructor: function Table(attrs, opts) {
				//this._opts = opts;    //opts is the number of line and row 
				Component.prototype.constructor.call(this, attrs);
			}
		});
});
