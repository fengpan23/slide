/*global define*/

define([
    "lodash",
    "libs/backbone",
], function (_, Backbone) {
    "use strict";

    var DeckModel = Backbone.Model.extend({
        defaults: {
            _id: null,
            filename: "",
            slides: "",
            activeSlide: "",
            background: "",
            picture: null
        },

        urlRoot: "/decks",

        idAttribute: "_id",

        initialize: function () {
            this.validators = {};

            this.validators.filename = function (value) {
                return value.length > 0 ? {
                    isValid: true
                } : {
                    isValid: false,
                    message: "You must enter a file name"
                };
            };

            this.validators.slides = function (value) {
                return value.length > 0 ? {
                    isValid: true
                } : {
                    isValid: false,
                    message: "You must enter a slides"
                };
            };

            this.validators.activeSlide = function (value) {
                return value.length > 0 ? {
                    isValid: true
                } : {
                    isValid: false,
                    message: "You must enter a activeSlide"
                };
            };

            this.validators.background = function (value) {
                return value.length > 0 ? {
                    isValid: true
                } : {
                    isValid: false,
                    message: "You must enter a background"
                };
            };
        },

        validateItem: function (key) {
            return (this.validators[key]) ? this.validators[key](this.get(key)) : {
                isValid: true
            };
        },

        // TODO: Implement Backbone's standard validate() method instead.
        validateAll: function () {

            var messages = {};

            for (var key in this.validators) {
                if (this.validators.hasOwnProperty(key)) {
                    var check = this.validators[key](this.get(key));
                    if (check.isValid === false) {
                        messages[key] = check.message;
                    }
                }
            }

            return _.size(messages) > 0 ? {
                isValid: false,
                messages: messages
            } : {
                isValid: true
            };
        }
    });

    return DeckModel;
});