define(['libs/backbone',
        'css!styles/widgets/video_control/videoControl.css'],
function(Backbone, DeltaDragControl, empty) {
	return Backbone.View.extend({
		className: "videoControl",
		events: {
			"click .btnx1": "speed",
			"click .btnx3": "speed",
			"click .btnPlay": "_videoPlay",
			"click .btnStop": "stop",
			"click .btnFS": "fullScreen",
			"click .sound": "adjustSoud",
			"click .volume": "volume",
			"click .videoProgress": "progress"
			
		},
		initialize: function() {
			this.$content = this.options.$el.find('.content');
			this.video = this.options.$el.find("video");
			delete this.options;
			this.completeloaded = false;
			
			this._canplay = this._canplay.bind(this);
			this._canplaythrough = this._canplaythrough.bind(this);
			this._ended = this._ended.bind(this);
			this._seeking = this._seeking.bind(this);
			this._seeked = this._seeked.bind(this);
			this._waiting = this._waiting.bind(this);
			this._loadeddata = this._loadeddata.bind(this);
			this._timeupdate = this._timeupdate.bind(this);
			this._videoPlay = this._videoPlay.bind(this);
			
			this._startBuffer = this._startBuffer.bind(this);
			
			this.video.on('canplay', this._canplay);
			this.video.on('canplaythrough', this._canplaythrough);
			this.video.on('ended', this._ended);
			this.video.on('seeking', this._seeking);
			this.video.on('seeked', this._seeked);
			this.video.on('waiting', this._waiting);
			this.video.on('loadedmetadata', this._loadeddata);
			this.video.on('timeupdate', this._timeupdate);
			this.video.on('click', this._videoPlay);
			this.render();
		},
		
		render: function() {
			this.$el.html(this._template());
			this.$content.append(this.$el);
			this.$content.addClass('videoContainer');
			//remove default control when JS loaded
			this.video[0].removeAttribute("controls");
		},

		progress: function(e) {
			this.updatebar(e.pageX);
		},
		
		updatebar: function(x) {
			var progress = $('.videoProgress');
			 var timeObj = $('.time');
			//calculate drag position
			//and update video currenttime
			//as well as progress bar
			var maxduration = this.video[0].duration;
			var position = x - progress.offset().left;
			var timeLeft = timeObj.offset().left;
			var percentage = 100 * position / (timeLeft - progress.offset().left);
			if(percentage > 100) {
				percentage = 100;
			}
			if(percentage < 0) {
				percentage = 0;
			}
			$('.timeBar').css('width',percentage+'%');	
			this.video[0].currentTime = maxduration * percentage / 100;
		},
		
		volume: function(e) {
			this.updateVolume(e.pageX);
		},
		
		updateVolume: function(x, vol) {
			var volume = $('.volume');
			var percentage;
			//if only volume have specificed
			//then direct update volume
			if(vol) {
				percentage = vol * 100;
			}
			else {
				var position = x - volume.offset().left;
				percentage = 100 * position / volume.width();
			}
			
			if(percentage > 100) {
				percentage = 100;
			}
			if(percentage < 0) {
				percentage = 0;
			}
			
			//update volume bar and video volume
			$('.volumeBar').css('width',percentage+'%');	
			this.video[0].volume = percentage / 100;
			
			//change sound icon based on volume
			if(this.video[0].volume == 0){
				$('.sound').removeClass('sound2').addClass('muted');
			}
			else if(this.video[0].volume > 0.5){
				$('.sound').removeClass('muted').addClass('sound2');
			}
			else{
				$('.sound').removeClass('muted').removeClass('sound2');
			}
		},
		
		_loadeddata: function() {
			var self = this;
			
			$('.control').show().css({'bottom':-45});
			$('.loading').fadeIn(500);
			$('.caption').fadeIn(500);
			$('.caption').animate({'top':-45},300);
			
			//set video properties
			$('.current').text(this.timeFormat(0));
			$('.duration').text(this.timeFormat(this.video[0].duration));
			this.updateVolume(0, 0.7);
				
			//start to get video buffering data 
			setTimeout(this._startBuffer, 150);
				
			//bind video events
			this.$content.find('.videoControl').append('<div id="init"></div>');
			
			this.$content.hover(function() {
				$('.control').stop().animate({'bottom':0}, 500);
				$('.caption').stop().animate({'top':0}, 500);
			}, function() {
				if(!self.volumeDrag && !self.timeDrag){
					$('.control').stop().animate({'bottom':-45}, 500);
					$('.caption').stop().animate({'top':-45}, 500);
				}
			})
			.on('click', function() {
				$('#init').remove();
				$('.btnPlay').addClass('paused');
				$(this).unbind('click');
				self.video[0].play();
			});
			$('#init').fadeIn(200);
		},
		
		_videoPlay: function() {
			if(this.video[0].paused || this.video[0].ended) {
				$('.btnPlay').addClass('paused');
				this.video[0].play();
			}
			else {
				$('.btnPlay').removeClass('paused');
				this.video[0].pause();
			}
		},
		
		_timeupdate: function() {
			var currentPos = this.video[0].currentTime;
			var maxduration = this.video[0].duration;
			var perc = 100 * currentPos / maxduration;
			$('.timeBar').css('width',perc+'%');	
			$('.current').text(this.timeFormat(currentPos));	
		},
		
		_waiting: function() {
			$('.loading').fadeIn(200);
		},
		
		//video seeked event
		_seeked: function() {
			
		},
		
		//video seeking event
		_seeking: function() {
			//if video fully loaded, ignore loading screen
			if(!this.completeloaded) {
				$('.loading').fadeIn(200);
			}	
		},
		
		//video ended event
		_ended: function() {
			$('.btnPlay').removeClass('paused');
			this.video[0].pause();
		},
		
		_canplaythrough: function() {
			this.completeloaded = true;
		},
		
		//VIDEO EVENTS
		//video canplay event
		_canplay: function() {
			$('.loading').fadeOut(100);
		},
		
		speed: function(e) {
			$('.text').removeClass('selected');
			$(e.currentTarget).addClass('selected');
			
			var spd = e.currentTarget.innerHTML.substring(1,2);
			this.video[0].playbackRate = parseInt(spd);
			this.video[0].play();
		},
		
		stop: function() {
			$('.btnPlay').removeClass('paused');
			this.updatebar($('.videoProgress').offset().left);
			this.video[0].pause();
		},
		
		adjustSoud: function(e) {
			this.video[0].muted = !this.video[0].muted;
			$(e.currentTarget).toggleClass('muted');
			if(this.video[0].muted) {
				$('.volumeBar').css('width',0);
			}
			else{
				$('.volumeBar').css('width', this.video[0].volume*100+'%');
			}
		},
		
		//fullscreen button clicked
		fullScreen: function() {
			if($.isFunction(this.video[0].webkitEnterFullscreen)) {
				this.video[0].webkitEnterFullscreen();
			}	
			else if ($.isFunction(this.video[0].mozRequestFullScreen)) {
				this.video[0].mozRequestFullScreen();
			}
			else {
				alert('Your browsers doesn\'t support fullscreen');
			}
		},
		
		//Time format converter - 00:00
		timeFormat: function(seconds){
			var m = Math.floor(seconds/60)<10 ? "0"+Math.floor(seconds/60) : Math.floor(seconds/60);
			var s = Math.floor(seconds-(m*60))<10 ? "0"+Math.floor(seconds-(m*60)) : Math.floor(seconds-(m*60));
			return m+":"+s;
		},
		
		/**
		 * @param {{$video}}
		 */
		_startBuffer: function() {
			var currentBuffer = this.video[0].buffered.end(0);
			var maxduration = this.video[0].duration;
			var perc = 100 * currentBuffer / maxduration;
			$('.bufferBar').css('width',perc+'%');
				
			if(currentBuffer < maxduration) {
				setTimeout(this._startBuffer, 500);
			}
		},
		
		_template: function() {
			return JST['tantaman.web.widgets/VideoControl'];
		}
	});
});