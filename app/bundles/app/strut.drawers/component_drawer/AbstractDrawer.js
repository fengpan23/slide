define(function() {
    "use strict";

    function AbstractDrawer(g2d) {
        this.g2d = g2d;
    }

    AbstractDrawer.prototype.applyTransforms = function(component, bbox) {
        var rotation = component.get('rotate');
        var scale = component.get('scale');
        this.g2d.translate(bbox.x, bbox.y); // draw on current position

		// if scaled, draw position by scale.
        this.g2d.translate(scale.x + bbox.width / 2, scale.y + bbox.height / 2);

		if (rotation) { // draw rotation
            this.g2d.rotate(rotation);
        }

		// Move registration point back to the top left corner of canvas
        this.g2d.translate(-1 * (scale.x + (bbox.width / 2)), -1 * (scale.y + (bbox.height / 2)));
        if (scale) { //  draw scale
            this.g2d.scale(scale.x, scale.y);
        }
		// draw back to the rotated current position
        this.g2d.translate(-1 * (bbox.x), -1 * (bbox.y));
    };

    return AbstractDrawer;
});
