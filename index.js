/**
 * The entry point for tota11y.
 *
 * Builds and mounts the toolbar.
 */

var $ = require("jquery");

var plugins = require("./plugins");
var toolbarTemplate = require("./templates/toolbar.handlebars");
var infoTemplate = require("./templates/info-panel.handlebars");

require("./less/toolbar.less");

class Toolbar {
    appendTo($el) {
        var $toolbar = $(toolbarTemplate());
        var $infoPanel = $(infoTemplate());

        $el.append($toolbar);
        $toolbar.after($infoPanel);

        $toolbar.find(".tota11y-toolbar-toggle").click(() => {
            $toolbar.toggleClass("tota11y-expanded")
        });

        // Attach each plugin
        var $pluginsContainer = $toolbar.find(".tota11y-plugins");
        plugins.forEach((plugin) => {
            plugin
                // Mount the plugin to the list
                .appendTo($pluginsContainer)
                // Register the info panel
                .registerInfo($infoPanel);
        });
    }
}

$(function() {
    var bar = new Toolbar();

    // TODO: Make this customizable
    bar.appendTo($("body"));
});
