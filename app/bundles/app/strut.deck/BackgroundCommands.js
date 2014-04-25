/**
 * @class BackgroundCommands
 */
define([''], function() {
	function BaseCommand(initial, scope, attr, name) {
		this.start = initial;
		this.end = scope.get(attr) || 0;
		this.scope = scope;
		this.name = name;
		this.attr = attr;
	}

	BaseCommand.prototype = {
		"do": function() {
			this.scope.set(this.attr, this.end);
		},
		undo: function() {
			this.scope.set(this.attr, this.start);
		},
		name: this.name
	};

	return {
		Theme: function(initial, scope, attr) {
			var name = attr.substring(0,1).toUpperCase() + attr.substring(1);
			return new BaseCommand(initial, scope, attr, name);
		}
	};
});
