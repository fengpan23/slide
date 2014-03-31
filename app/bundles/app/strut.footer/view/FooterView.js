define([ 'libs/backbone',
         'css!styles/footer/footer.css'
], function(Backbone, empt) {
    "use strict";

    return Backbone.View.extend({
    	className: 'footer',
    	
        events: {
            "click .about-link": '_aboutPage',
            destroyed: 'remove'
        },

        initialize: function() {
        	this._template = JST['strut.footer/Footer'];
        },

        render: function() {
//        	console.log(this._template);
//        	var currentPage = this.mode.a
        	
            this.$el.html(this._template());
            return this;
        },

        _aboutPage: function (e) {
            e.preventDefault();
//            Backbone.history.navigate('/about', {trigger:true});
        },
        
        dispose: function() {
        	Backbone.View.prototype.remove.call(this);
		},
        
        constructor: function FooterView() {
			Backbone.View.prototype.constructor.apply(this, arguments);
		}
    });
});
