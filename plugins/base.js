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

require("./style.less");

class Plugin {
    constructor() {
        this.$checkbox = null;
    }

    getTitle() {
        return "New plugin";
    }

    getDescription() {
        return "";
    }

    /**
     * Renders the plugin view.
     */
    render(clickHandler) {
        this.$checkbox = (
            <input
                className="tota11y-plugin-checkbox tota11y-sr-only"
                type="checkbox"
                onClick={() => clickHandler(this)} />
        );

        let $switch = (
            <label className="tota11y-plugin-switch">
                {this.$checkbox}
                <div aria-hidden="true"
                     className="tota11y-plugin-indicator">
                    &#x2713;
                </div>
                <div className="tota11y-plugin-info">
                    <div className="tota11y-plugin-title">
                        {this.getTitle()}
                    </div>
                    <div className="tota11y-plugin-description">
                        {this.getDescription()}
                    </div>
                </div>
            </label>
        );

        let $el = (
            <li role="menu-item" className="tota11y-plugin">
                {$switch}
            </li>
        );

        return $el;
    }

    /**
     * Activate the plugin from the UI.
     */
    activate() {
        this.run();
    }

    /**
     * Deactivate the plugin from the UI.
     */
    deactivate() {
        this.cleanup();
        this.$checkbox.prop("checked", false);
    }
}

module.exports = Plugin;
