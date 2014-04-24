/*
@author Matt Crinklaw-Vogt
*/
define(['libs/backbone', 'libs/imgup'],
function(Backbone, Imgup) {
	var modalCache = {};
	var reg = /^[a-z]+:/;
	var imgup = new Imgup('847de02274cba30');

	var ignoredVals = {
		'http:': true,
		'http://': true,
		'file:': true,
		'/': true,
		'https://': true,
		'https:': true
	};

	var Modal = Backbone.View.extend({
		className: "itemGrabber modal hide",
		events: {
			"click .ok": "okClicked",
			"click div[data-option='browse']": "browseClicked",
			"change input[type='file']": "fileChosen",
			"keyup input[name='itemUrl']": "urlChanged",
			"paste input[name='itemUrl']": "urlChanged",
			"hidden": "hidden",
			"dragover": "_dragover",
			"drop": "_drop",
			"dragleave": "_dragleave"
		},
		initialize: function() {
			this.loadItem = _.debounce(this.loadItem.bind(this), 200);
		},
		show: function(cb) {
			this.cb = cb;
			this.$el.modal('show');
			this.$input.focus();
			this.$el.find(".ok").addClass("disabled");
			if(this.options.tag === 'iframe'){
				$(window).bind('beforeunload', function(){
					return '您嵌入的iframe会使网页跳转严重影响您的体验'; 
				}); 
			}
		},
		okClicked: function(e) {
			e.stopPropagation();
			e.preventDefault();
			if (!this.$el.find(".ok").hasClass("disabled")) {
				if (this.file != null) {
					this.cb({
						file: this.file,
						src: this.src
					});
				} else {
					this.cb(this.src);
				}
				return this.$el.modal('hide');
			}
		},

		_dragover: function(e) {
			e.stopPropagation();
			e.preventDefault();
			e.originalEvent.dataTransfer.dropEffect = 'copy';

			this.$droparea.addClass('active');
		},

		_dragleave: function(e) {
			this.$droparea.removeClass('active');
		},

		_drop: function(e) {
			this.$droparea.removeClass('active');
			e.stopPropagation();
			e.preventDefault();
			var f = e.originalEvent.dataTransfer.files[0];

			this._fileChosen(f);
		},

		fileChosen: function(e) {
			var f, reader,
				_this = this;
			f = e.target.files[0];

			this._fileChosen(f);
			//Solve the repeated select files onchang event is invalid
			this.$el.find('input[type="file"]').replaceWith('<input type="file" style="display:none"></input>');
		},

		_fileChosen: function(f) {
			if (!f.type.match('image.*')){
				this.item.src = '';
				this._itemLoadError();
				return;
			}
			
			this.item.src = '';
			var _this = this;
			
			var reader = new FileReader();
			reader.onload = function(e) {
				_this.src = e.target.result; // reader's return value after read.
				_this._itemLoaded();
            };
            // run after file selected, because e.target block thread
            reader.readAsDataURL(f);
            
            //use all image as data base64
			if (this.options.hasStorage()) {
				var url = URL.createObjectURL(f);
				this.$input.val(url);
				this.item.src = url;
				URL.revokeObjectURL(url);
//				this.file = f;
			} else {
				alert('img up load have some problem with storage');
				this._switchToProgress();

				imgup.upload(f).progress(function(ratio) {
					_this._updateProgress(ratio);
				}).then(function(result) {
					_this._switchToThumbnail();
					_this.$input.val(result.data.link);
					_this.urlChanged({
						which: -1
					});
				}, function() {
					_this._updateProgress(0);
					_this._switchToThumbnail();
					_this.$input.val('Failed to upload image to imgur');
				});
			}
		},

		browseClicked: function() {
			return this.$el.find('input[type="file"]').click();
		},
		hidden: function() {
			$(window).unbind('beforeunload');
			this.$el.find(".ok").addClass("disabled");
			if (this.$input != null) {
				this.item.src = '';
				this.file = null;
				return this.$input.val("");
			}
		},
		urlChanged: function(e) {
			if (e.which === 13) {
				this.src = this.$input.val();
				return this.okClicked(e);
			} else {
				this.loadItem();
			}
		},
		loadItem: function() {
			var val = this.$input.val();

			if (val in ignoredVals)
				return;

			var r = reg.exec(val);
			if (r == null || r.index != 0) {
				if (val !== '')
					val = 'http://' + val;
			}

			if (this.item.src != val)
				this.item.src = val;
			
			var _this = this;
			this.item.onerror = function() {
				return _this._itemLoadError();
			};
			this.item.onload = function() {
				return _this._itemLoaded();
			};
			this.item.onloadstart = function() {
				return _this._itemLoaded();
			};
			
			return this.src = this.item.src;
		},
		_itemLoadError: function() {
			this.$el.find(".ok").addClass("disabled");
			return this.$el.find(".alert").removeClass("dispNone");
		},
		_itemLoaded: function() {
			this.$el.find(".ok").removeClass("disabled");
			return this.$el.find(".alert").addClass("dispNone");
		},
		// should probably just make a sub component to handle progress
		_updateProgress: function(ratio) {
			this.$progressBar.css('width', ratio * 100 + '%');
		},
		_switchToProgress: function() {
			this.$thumbnail.addClass('dispNone');
			this.$progress.removeClass('dispNone');
		},
		_switchToThumbnail: function() {
			this.$progress.addClass('dispNone');
			this.$thumbnail.removeClass('dispNone');
		},
		render: function() {
			var _this = this;
			this.$el.html(JST["tantaman.web.widgets/ItemImportModal"](this.options));
			this.$el.modal();
			this.$el.modal("hide");
			this.item = this.$el.find(this.options.tag)[0];
			
			if (this.options.tag === "video") {
				this.$el.find(".modal-body").prepend("<div class='alert alert-success'>支持 Ogg， MPEG4，WebM格式（http://vjs.zencdn.net/v/oceans.mp4）</div>");
			}
//			if (!this.options.ignoreErrors ) {
//				this.item.onerror = function() {
//					return _this._itemLoadError();
//				};
//				this.item.onload = function() {
//					return _this._itemLoaded();
//				};
//			}
			this.$input = this.$el.find("input[name='itemUrl']");
			this.$progress = this.$el.find('.progress');
			this.$progressBar = this.$progress.find('.bar');
			this.$thumbnail = this.$el.find('.thumbnail');
			this.$droparea = this.$el.find('.droparea');
			this.$el.find(".ok").addClass("disabled");
			return this.$el;
		},
		constructor: function ItemImportModal() {
		Backbone.View.prototype.constructor.apply(this, arguments);
	}
	});

	return {
		get: function(options) {
			var previous = modalCache[options.tag];

			if (!previous) {
				previous = new Modal(options);
				previous.$el.bind('destroyed', function() {
					delete modalCache[options.tag];
				});

				modalCache[options.tag] = previous;

				previous.render();
				$('#modals').append(previous.$el);
			}

			return previous;
		},

		ctor: Modal
	};
});
