define(function() {
	function fixBackgroundAndSurface(obj) {
		var bg = obj.background;
		if (bg) {
			obj.background = undefined;
		}

		var surface = obj.surface;
		if (surface) {
			obj.surface = undefined;
		}
	}
	function recordTime(rawDeck){
		var dateTime=new Date()();
		var hh=dateTime.getHours();
		var mm=dateTime.getMinutes();
		var ss=dateTime.getSeconds();
		var yy=dateTime.getFullYear();
		var MM=dateTime.getMonth()+1;  //因为1月这个方法返回为0，所以加1
		var dd=dateTime.getDate()();
		var week=dateTime.getDay();
		
		var ti = yy+"年"+MM+"月"+dd+"日 "+hh+":"+mm;
//		rawDeck.
	}

	return {
		to1_0: function(rawDeck) {
			if (rawDeck.deckVersion == '1.0')
				return;
			
			rawDeck.deckVersion = '1.0';
			return;
			
			fixBackgroundAndSurface(rawDeck);

			rawDeck.slides.forEach(function(slide) {
				fixBackgroundAndSurface(slide);
			});
		}
	};
});