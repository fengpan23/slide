/*global define*/

define([
    "lodash",
    "libs/backbone",
    "./DeckModel"
], function (_, Backbone, DeckModel) {
    "use strict";

    var DeckCollection = Backbone.Collection.extend({
        model: DeckModel,

        url: "/decks"
    });

    return DeckCollection;
});
