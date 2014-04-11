define(['strut/deck/Component'],
function(Component) {
	'use strict';

	return Component.extend({
		initialize: function() {
			Component.prototype.initialize.apply(this, arguments);
			this.set('type', 'Shape');
			var markup = this.get('markup');
			if(typeof markup === 'object'){
				var mark = '<svg><defs><marker id="startArrow" viewBox="0 0 20 20" refX="0" refY="10" markerUnits="strokeWidth" markerWidth="3" markerHeight="10" orient="auto"><path d="M 0 10 L 20 0 L 20 20 z" fill="purple" stroke="black"></path></marker><marker id="endArrow" viewBox="0 0 20 20" refX="0" refY="10" markerUnits="strokeWidth" markerWidth="3" markerHeight="10" orient="auto"><path d="M 0 0 L 20 10 L 0 20 z" fill="purple" stroke="black"></path></marker></defs><line stroke="purple" fill="none" '
//					+ ' stroke-width="' + markup.width
					+ ' stroke-width="' + 3
					+ '" x1="' + (markup.x1 - this.get('x'))
					+ '" y1="' + (markup.y1 - this.get('y'))
					+ '" x2="' + (markup.x2 - this.get('x'))
					+ '" y2="' + (markup.y2 - this.get('y'));
					
				if(markup.Arrow1){
					mark += '" marker-start="url(#startArrow)"';
				}
				if(markup.Arrow2){
					mark += '" marker-end="url(#endArrow)"';
				}
				if(markup.dashing){
					mark += '" stroke-dasharray="3 2';
				}
				
				mark += '"></line></svg>'; 
				this.set('markup', mark);
			}
		},

		constructor: function Shape(attrs) {
			Component.prototype.constructor.call(this, attrs);
		}
	});
});