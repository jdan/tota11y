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

        let activePlugin = null;
        let handlePluginClick = (plugin) => {
            if (plugin === activePlugin) {
                plugin.cleanup();
                plugin.panel.destroy();
                plugin.$checkbox.attr("checked", false);

                activePlugin = null;
            } else {
                if (activePlugin) {
                    activePlugin.cleanup();
                    activePlugin.panel.destroy();
                    activePlugin.$checkbox.attr("checked", false);
                }

                plugin.run();
                plugin.panel.render();

                activePlugin = plugin;
            }
        };

        let $plugins = (
            <div className="tota11y-plugins">
                {plugins.map((plugin) => plugin.render(handlePluginClick))}
            </div>
        );

        let handleToggleClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            $toolbar.toggleClass("tota11y-expanded");
        };

        let $toggle = (
            <a href="#"
               className="tota11y-toolbar-toggle"
               onClick={handleToggleClick}>
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
