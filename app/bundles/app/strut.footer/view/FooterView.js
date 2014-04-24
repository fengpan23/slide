define([ 'libs/backbone'
], function(Backbone) {
    "use strict";

    var reg = /http:\/\/([^\/]+)\//i;
    
    return Backbone.View.extend({
    	className: 'footer',
    	
        events: {
            "click .about-link": '_aboutPage',
            destroyed: 'remove'
        },

        initialize: function() {
        	this._template = JST['strut.footer/Footer'];
        	this.model.on("change:filename", this.render, this);
        	this.model.on("change:lxid", this._deckInformastion, this);
        	this.model.on("userData", this.render, this);
        },

        render: function() {
            this.$el.html(this._template(this.model.attributes));
            return this;
        },
        
        _deckInformastion: function() {
        	var referrer = window.document.referrer;
//        	var domain = referrer.substring(0, referrer.indexOf('?'));
//        	var referrer = "http://3a.sc.lxpt.cn/139/index.php";
//        	var domain = "mlyu.lxpt.cn";
        	var  domain = referrer.match(reg);
        	
        	if(domain){
        		domain = domain[1];
        		console.log(domain);
            	var info = {
            		domain: domain,
            		lxid: this.model.get('lxid')
            	};
            	var _this = this;
            	var XMLHttp = new XMLHttpRequest();
            	XMLHttp.open('post', 'transpond/lxUser');  
            	XMLHttp.onreadystatechange = function() {
            		  if (XMLHttp.readyState === 4) {
            			  var data = JSON.parse(XMLHttp.responseText);
            			  _this.model.set('name', data.name);
            			  _this.model.set('avatar', data.avatar);
            			  _this.model.set('email', data.email);
            			  _this.model.set('domain', info.domain);
            			  _this.model.trigger('userData');
            			  console.log(data);
            		  }else{
            			  console.log('XMLHttp open error: ' + XMLHttp.readyState);
            		  }
            	};
            	XMLHttp.send(JSON.stringify(info));
        	}
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
