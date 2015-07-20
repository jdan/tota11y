/**
 * The entry point for tota11y.
 *
 * Builds and mounts the toolbar.
 */

// Require the base tota11y styles right away so they can be overwritten
require("./less/tota11y.less");

let $ = require("jquery");

let plugins = require("./plugins");
let logoTemplate = require("./templates/logo.handlebars");

// Chrome Accessibility Developer Tools - required once as a global
require("script!./node_modules/accessibility-developer-tools/dist/js/axs_testing.js");

class Toolbar {
    appendTo($el) {
        let $logo = $(logoTemplate());
        let $toolbar;

        // Attach each plugin
        let $plugins = <div className="tota11y-plugins" />;
        plugins.forEach((plugin) => {
            // Mount the plugin to the list
            plugin.appendTo($plugins);
        });

        let handleClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            $toolbar.toggleClass("tota11y-expanded");
        };

        let $toggle = (
            <a href="#"
               className="tota11y-toolbar-toggle"
               onClick={handleClick}>
                <div className="tota11y-toolbar-logo">
                    {$logo}
                </div>
            </a>
        );

        $toolbar = (
            <div className="tota11y tota11y-toolbar">
                <div className="tota11y-toolbar-body">
                    {$plugins}
                </div>
                {$toggle}
            </div>
        );

        $el.append($toolbar);
    }
}

$(function() {
    // Attach the global `axs` object from Accessibility Developer Tools to $
    $.axs = axs;

    var bar = new Toolbar();

    // TODO: Make this customizable
    bar.appendTo($("body"));
});
