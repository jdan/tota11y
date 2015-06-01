/**
 * The entry point for tota11y.
 *
 * Builds and mounts the toolbar.
 */

// Require the base tota11y styles right away so they can be overwritten
require("./less/tota11y.less");

var $ = require("jquery");

var plugins = require("./plugins");
var toolbarTemplate = require("./templates/toolbar.handlebars");

// Chrome Accessibility Developer Tools - required once as a global
require("script!./node_modules/accessibility-developer-tools/dist/js/axs_testing.js");

class Toolbar {
    appendTo($el) {
        var $toolbar = $(toolbarTemplate());
        $el.append($toolbar);

        $toolbar.find(".tota11y-toolbar-toggle").click(() => {
            $toolbar.toggleClass("tota11y-expanded")
        });

        // Attach each plugin
        var $pluginsContainer = $toolbar.find(".tota11y-plugins");
        plugins.forEach((plugin) => {
            // Mount the plugin to the list
            plugin.appendTo($pluginsContainer);
        });
    }
}

$(function() {
    var bar = new Toolbar();

    // TODO: Make this customizable
    bar.appendTo($("body"));
});
