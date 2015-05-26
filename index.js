/**
 * The entry point for tota11y.
 *
 * Builds and mounts the toolbar.
 */

var $ = require("jquery");

var plugins = require("./plugins");
var toolbarTemplate = require("./templates/toolbar.handlebars");

// Chrome Accessibility Developer Tools - required once as a global
require("script!./node_modules/accessibility-developer-tools/dist/js/axs_testing.js");

require("./less/tota11y.less");

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
