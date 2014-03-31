define(["lodash", "./AbstractDrawer"
], function(_, AbstractDrawer) {
    "use strict";
    var newlineReg = /<br>|<\/div>|<\/li>/;
    var spaceReg = /&nbsp;/g;
    var tagReg = /<[^>]+>|<\/[^>]+>/g;

    function TextBoxDrawer(g2d) {
        AbstractDrawer.apply(this, arguments);
    }

    _.extend(TextBoxDrawer.prototype, AbstractDrawer.prototype);

    TextBoxDrawer.prototype.paint = function(textBox) {
    	
    	var text = this._convertSpaces(textBox.get('text'));
    	var lines = this._extractLines(text);
        var txtWidth = this._findWidestWidth(lines) * this.scale.x;
        var lineHeight = textBox.get('size') * this.scale.x;
        
    	var bbox = {
    			x: textBox.get('x') * this.scale.x,
    			y: textBox.get('y') * this.scale.y,
    			width: textBox.get('width'),
    			height: lineHeight * lines.length
    	};
    	
    	this.applyTransforms(textBox, bbox);
    	
    	
		lines.forEach(function(line, i) {
			var $texts = $(line).find('font, span');
			var align =  $(line).css('text-align');
			
			bbox.x = textBox.get('x');
			
			if(align){
				if(align === 'center'){
					bbox.x += bbox.width/2;
				}else if(align === 'right'){
					bbox.x += bbox.width;
				}
				this.g2d.textAlign = align;
			}else{
				this.g2d.textAlign = 'start';
			}
			
			var t = '';
			
			var _this = this;
			$texts.each(function(j) {
				var color = '#333333';
				if(this.color){
					color = this.color;
				}
				_this.g2d.fillStyle = color;
				_this.g2d.font = lineHeight + 'px ' + this.face;
				console.log('draw text' + this.innerHTML);
				_this._renderLine(this.innerHTML, i, bbox, lineHeight, _this.g2d.measureText(t).width);
				
				t += this.innerHTML;
			});
		}, this);
    };

    TextBoxDrawer.prototype._renderLine = function(line, cnt, bbox, lineHeight, offsetW) {
        if (line !== '') {
            line = line.replace(tagReg, '');
            
            var x = bbox.x + offsetW;
            var y = bbox.y + lineHeight + cnt * lineHeight;
            
            this.g2d.fillText(line, x, y);
            cnt += 1;
        }
    };

    TextBoxDrawer.prototype._extractLines = function(text) {
        return text.split(newlineReg);
    };

    TextBoxDrawer.prototype._convertSpaces = function(text) {
        return text.replace(spaceReg, ' ');
    };

    TextBoxDrawer.prototype._findWidestWidth = function(lines) {
        var widestWidth = 0;
        lines.forEach(function(line) {
            var width;
            
            width = this.g2d.measureText(line.replace(tagReg, "")).width;
            if (width > widestWidth) {
                widestWidth = width;
            }
        }, this);
        return widestWidth;
    };

    return TextBoxDrawer;
});
