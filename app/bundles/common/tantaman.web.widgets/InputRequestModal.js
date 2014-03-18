define(
function() {
	function InputRequestModal(options) {
		this.$el = $('<div class="modal hide"></div>');
		this._okClicked = this._okClicked.bind(this);
		this._focus = this._focus.bind(this);
		this.$el.on('click', '.ok', this._okClicked);
		this.options = options;

		this.$el.modal({
			show: false
		});
	}

	InputRequestModal.prototype = {
		render: function() {
			this.$el.html(
				JST['tantaman.web.widgets/InputRequestModal'](this.options));
			this.$input = this.$el.find('input');
			this.$input.on('focus', this._focus);
			
			this.$errors = this.$el.find('.errors');

			return this;
		},

		show: function(cb, value) {
			this.cb = cb;
			if (value)
				this.$input.val(value);
			this.$errors.html('');
			this.$el.modal('show');
			this.$input.focus();
		},
		
		_focus: function() {
			if(this.$input.val().indexOf('presentation-') === 0){
				this.$input.val('')
			}
		},

		hide: function() {
			this.$el.modal('hide');
		},

		_okClicked: function(e) {
			e.stopPropagation();
			e.preventDefault();
			var input = this.$input.val();
			var result = this.cb(input);
			if (result == true)
				this.hide();
			else {
				this.$errors.html(JST['tantaman.web.widgets/List'](result));
			}
		}
	}

	return InputRequestModal;
});