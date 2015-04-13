/**
 * Base class for plugins.
 *
 * This module defines methods to render and mount plugins to the toolbar.
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

    render() {
        var templateData = {
            title: this.getTitle(),
            description: this.getDescription()
        };

        return $(template(templateData));
    }

    appendTo($el) {
        var $plugin = this.render();
        $el.append($plugin);

        $plugin.click(() => this.run());
    }
}

module.exports = Plugin;
