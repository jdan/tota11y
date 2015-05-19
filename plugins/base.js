/**
 * Base class for plugins.
 *
 * This module defines methods to render and mount plugins to the toolbar.
 * Each plugin will define four methods:
 *     getTitle: title to display in the toolbar
 *     getDescription: description to display in the toolbar
 *     run: code to run when the plugin is activated from the toolbar
 *     cleanup: code to run when the plugin is deactivated from the toolbar
 */

var $ = require("jquery");
var template = require("../templates/plugin.handlebars");

class Plugin {
    getTitle() {
        return "New plugin";
    }

    getDescription() {
        return "";
    }

    /**
     * Renders the plugin view.
     */
    render() {
        let templateData = {
            title: this.getTitle(),
            description: this.getDescription()
        };

        return $(template(templateData));
    }

    /**
     * Attaches the plugin to a given DOMNode.
     * (chainable)
     */
    appendTo($el) {
        // Render and mount plugin
        var $plugin = this.render();
        $el.append($plugin);

        // Register events
        let $checkbox = $plugin.find(".tota11y-plugin-checkbox");
        $checkbox.click(() => {
            if ($checkbox.is(":checked")) {
                this.run();
            } else {
                this.cleanup();
            }
        });

        return this;
    }
}

module.exports = Plugin;
