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
var template = require("../../templates/plugin.handlebars");

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
        var templateData = {
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
        var $checkbox = $plugin.find(".tota11y-plugin-checkbox");
        $checkbox.click(() => {
            this.active = $checkbox.is(":checked");

            // You can probably change the class based on active being true
            // or not
            if (this.active) {
                var infoHtml = this.run();

                if (infoHtml) {
                    this.$infoContainer
                        .html(infoHtml)
                        .addClass("active");
                }
            } else {
                this.cleanup();
                this.$infoContainer.removeClass("active");
            }
        });

        return this;
    }

    /**
     * Registers a container in which to display more information.
     * (chainable)
     */
    registerInfo($el) {
        this.$infoContainer = $el;
        return this;
    }
}

module.exports = Plugin;
