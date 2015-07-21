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

class Plugin {
    constructor() {
        this.panel = new InfoPanel(this.getTitle());
        this.$checkbox = null;
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
    error(title, $description, $el) {
        return this.panel.addError(title, $description, $el);
    }

    /**
     * Renders the plugin view.
     */
    render(onClick) {
        let templateData = {
            title: this.getTitle(),
            description: this.getDescription()
        };

        let $plugin = $(template(templateData));

        this.$checkbox = $plugin.find(".tota11y-plugin-checkbox");
        this.$checkbox.click((e) => {
            e.stopPropagation();
            onClick(this);
        });

        return $plugin;
    }
}

module.exports = Plugin;
