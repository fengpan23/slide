define(["lodash", "./AbstractDrawer"
], function(_, AbstractDrawer) {
    "use strict";

    function ImageModelDrawer(g2d) {
        AbstractDrawer.apply(this, arguments);
    }

    _.extend(ImageModelDrawer.prototype, AbstractDrawer.prototype);

    ImageModelDrawer.prototype.paint = function(imageModel) {
        this._imageLoaded(imageModel.get('scale'), imageModel);
    };

    ImageModelDrawer.prototype._imageLoaded = function(image, imageModel) {
        var bbox = {
            x: imageModel.get('x') * this.scale.x,
            y: imageModel.get('y') * this.scale.y,
            width: image.width * this.scale.x,
            height: image.height * this.scale.y
        };
        
        this.applyTransforms(imageModel, bbox);

        var oImg = new Image();
        oImg.src = imageModel.uri
        this.g2d.drawImage(oImg, bbox.x, bbox.y);
    };

    return ImageModelDrawer;
});
