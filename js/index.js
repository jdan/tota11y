/**
 * The entry point for tota11y.
 *
 * Builds and mounts the toolbar.
 */

var $ = require("jquery");

var plugins = require("./plugins");
var template = require("../templates/toolbar.handlebars");

class Toolbar {
    appendTo($el) {
        var $toolbar = $(template());
        $el.append($toolbar);

        // Attach each plugin
        var $pluginsContainer = $toolbar.find(".plugins");
        plugins.forEach((plugin) => {
            plugin.appendTo($pluginsContainer)
        });
    }
}

$(function() {
    var bar = new Toolbar();
    bar.appendTo($("body"));
});
