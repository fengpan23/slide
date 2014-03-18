/*global define*/

define([
    "jquery",
    "libs/backbone"
], function($, Backbone) {
    "use strict";

    //var registry;
    //var storageInterface = registry.getBest('cloudslide.StorageInterface');

    var Router = Backbone.Router.extend({
        routes: {
            // Define some URL routes
			"": "lastDeck",
            "deck/:id": "editDeck",

            // Default - catch all
            '*actions': 'defaultAction'
        },
        initialize: function(registry) {
            this.registry = registry;
        },
/*  
        _showView: function(selector, view) {
            if (this.currentView instanceof Backbone.View) {
                this.currentView.dispose();
            }

            this.currentView = view;

            if (this.currentView.view) {
                $(selector).html(this.currentView.view.$el);
            } else {
                $(selector).html(this.currentView.$el);
            }
        },
 *//* 
        list: function(page) {
            var p = page ? parseInt(page, 10) : 1;
            var self = this;
            storageInterface.list(function(decks) {
                self._showView('#content', new DeckListView({
                    collection: decks,
                    page: p
                }));
            });
            this.headerView.selectMenuItem('get-menu');
        },
 */
		lastDeck: function(){
			var storageInterface = this.registry.getBest('strut.StorageInterface');
			storageInterface.selectProvider("largelocalstorage");
			var StartupService = this.registry.getBest('strut.StartupTask');
			StartupService.run();
		},
		
		
        editDeck: function(id) {
			//TODO  change the selectPtovider
			var storageInterface = this.registry.getBest('strut.StorageInterface');
			storageInterface.selectProvider("remotestorage");
			// storageInterface.selectProvider("localstorage");
			console.log(storageInterface.currentProvider());
			var self = this;
            storageInterface.load(id, function(deck, err) {
                if (!err) {
                    var StartupService = self.registry.getBest('strut.StartupTask');
					console.log(deck);
                    StartupService.run(deck);
                } else {
                    console.log(err.stack);
                }
            });
//			storageInterface.selectProvider("largelocalstorage");
        },
/* 
        home: function() {
            this._showView('#content', new HomeView());
            this.headerView.selectMenuItem('home-menu');
        },

        about: function() {
            this._showView('#content', new AboutView());
            this.headerView.selectMenuItem('about-menu');
        },

        signup: function() {
            this.user = new UserModel();
            this._showView('#content', new SignupView({
                model: this.user
            }));
            this.headerView.selectMenuItem('signup-menu');
        },
 */
        // defaultAction: function() {
            // this._showView('#content', new NotFoundView());
        // }
    });

    return Router;
});
