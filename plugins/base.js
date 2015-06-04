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

let $ = require("jquery");
let InfoPanel = require("./shared/info-panel");
let template = require("../templates/plugin.handlebars");
let id = 1;

class Plugin {
    constructor() {
        this.id = id++;
        this.panel = new InfoPanel(this.getTitle());
    }

    getTitle() {
        return "New plugin";
    }

    getDescription() {
        return "";
    }

    /**
     * Methods that communicate directly with the info panel
     * TODO: Consider names like `setSummary` and `addError`
     */

    // Populates the info panel's "Summary" tab
    summary($html) {
        return this.panel.setSummary($html);
    }

    // Populates the info panel's "About" tab
    about($html) {
        return this.panel.setAbout($html);
    }

    // Adds an entry to the info panel's "Errors" tab
    error(title, description, $el) {
        return this.panel.addError(title, description, $el);
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
        let $plugin = this.render();
        $el.append($plugin);

        let $checkbox = $plugin.find(".tota11y-plugin-checkbox");

        $checkbox.click((e) => {
            e.stopPropagation();

            // Trigger a `plugin-switched` event on the container, which will
            // be dispatched to all plugins. We include this plugin's ID to
            // determine if we should enable or disable the plugin listening
            // for this event.
            $el.trigger("plugin-switched", [this.id]);

            // If our checkbox is checked, run and render the panel.
            // Otherwise, cleanup.
            if ($checkbox.is(":checked")) {
                this.run();
                this.panel.render();
            } else {
                this.cleanup();
                this.panel.destroy();
            }
        });

        // Listen for the `plugin-switched` event on the plugins container.
        $el.on("plugin-switched", (e, id) => {
            // If we are the plugin that the user has interacted with, ignore
            // this step. We handle our own behavior before the event is
            // dispatched.
            if (id === this.id) {
                return;

            // If we are an active plugin that the user switched from, we
            // uncheck ourselves and clean up.
            } else if ($checkbox.is(":checked")) {
                $checkbox.attr("checked", false);
                this.cleanup();
                this.panel.destroy();
            }
        });

        return this;
    }
}

module.exports = Plugin;
