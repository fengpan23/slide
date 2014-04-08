define({
	computeSlideDimensions: function($opTable) {
		var width = $opTable.width();
		var height = $opTable.height();

		if (height < 300)
			height = 300;

		var slideSize = config.slide.size;

		var xScale = width / slideSize.width;
		var yScale = (height - 20) / slideSize.height;

		var newHeight = slideSize.height * xScale;
		if (newHeight > height) {
			var scale = yScale;
		} else {
			var scale = xScale;
		}

		var scaledWidth = scale * slideSize.width;
		var scaledHeight = scale * slideSize.height;

		var remainingWidth = width - scaledWidth;
//		var remainingHeight = height - scaledHeight;

		return {
			scale: scale,
			scaledWidth: scaledWidth,
//			remainingHeight: remainingHeight,
			remainingWidth: remainingWidth
		}
	}
});