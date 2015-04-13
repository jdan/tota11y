/**
 * The entry point for tota11y.
 *
 * Builds and mounts the toolbar.
 */

var $ = require("jquery");

var plugins = require("./plugins");
var template = require("../templates/toolbar.handlebars");

require("../less/toolbar.less");

class Toolbar {
    appendTo($el) {
        var $toolbar = $(template());
        $el.append($toolbar);

        $toolbar.find(".toolbar-toggle").click(() => {
            $toolbar.toggleClass("expanded")
        });

        // Attach each plugin
        var $pluginsContainer = $toolbar.find(".plugins");
        plugins.forEach((plugin) => {
            plugin.appendTo($pluginsContainer)
        });
    }
}

$(function() {
    var bar = new Toolbar();

    // TODO: Make this customizable
    bar.appendTo($("body"));
});
