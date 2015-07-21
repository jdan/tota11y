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
    /**
     * Renders the toolbar and appends it the specified element.
     */
    appendTo($el) {
        let $logo = $(logoTemplate());
        let $toolbar;

        // Manages the state of the toolbar when a plugin is clicked, and
        // toggles the appropriate plugins
        let activePlugin = null;
        let handlePluginClick = (plugin) => {
            // If the plugin was already selected, toggle it off
            if (plugin === activePlugin) {
                plugin.deactivate();
                activePlugin = null;
            } else {
                // Deactivate the active plugin if there is one
                if (activePlugin) {
                    activePlugin.deactivate();
                }

                // Activate the selected plugin
                plugin.activate();
                activePlugin = plugin;
            }
        };

        let $plugins = (
            <div className="tota11y-plugins">
                {
                    plugins.map((plugin) => {
                        // Render each plugin with the click handler
                        return plugin.render(handlePluginClick);
                    })
                }
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
