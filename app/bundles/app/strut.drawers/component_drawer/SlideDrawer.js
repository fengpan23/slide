define(["lodash", './slide2Image'],
function(_, Slide2Image) {
    "use strict";

    /**
     * Slide snapshot drawer. Paints all elements on little slide thumbnail in SlideWell.
     */
    function SlideDrawer(model, g2d, registry) {
        this.model = model;
        this.g2d = g2d;

        this.repaint = this.repaint.bind(this);
        this.repaint = _.debounce(this.repaint, 250);

        this.size = {
            width: this.g2d.canvas.width,
            height: this.g2d.canvas.height
        };

        this.scale = {
            x: this.size.width / config.slide.size.width,
            y: this.size.height / config.slide.size.height
        };
        
        var drawerEntries = registry.get('strut.ComponentDrawer');

        this._drawers = {};
        drawerEntries.forEach(function(entry) {
            var Drawer = entry.service();
            Drawer = this._drawers[entry.meta().type] = new Drawer(this.g2d);
            Drawer.scale = this.scale;
        }, this);
    }

    SlideDrawer.prototype = {
        repaint: function(bg) {
            this._paint(bg);
        },

        _paint: function(bg) {
            this.g2d.clearRect(0, 0, this.size.width, this.size.height);

            this._paintbg(bg, this.size.width, this.size.height);

            var components = this.model.get('components');

            components.forEach(function(component) {
                var type = component.get('type');
                var drawer = this._drawers[type];
                if (drawer) {
                	this.g2d.save();
                	drawer.paint(component);
                	this.g2d.restore();
                }
            }, this);
        },

        _paintbgImg: function(bg) {
            var oImg = new Image();
            oImg.src = bg;
            console.log(oImg);

            this.g2d.drawImage(oImg, 0, 0);
        },

        _paintbg: function(bg, w, h) {
            this.g2d.fillStyle = bg;
            this.g2d.fillRect(0, 0, w, h);
        },
        
        _toImage: function(oCanvas, w, h) {
        	 return Slide2Image.saveAsBase64(oCanvas, w, h);
		},

        dispose: function() {
            this.model.off(null, null, this);
        }
    };

    return SlideDrawer;
});
