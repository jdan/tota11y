/**
 * The following code defines an information panel that can be invoked from
 * any plugin to display summaries, errors, or more information about what
 * the plugin is doing.
 *
 * These panels are moveable and closeable, and are unique to the plugin that
 * created them. They appear in the bottom right corner of the viewport.
 *
 * Info panels consist of a title and three optional sections, which form
 * tabs that users can switch between.
 *
 *   Summary: A summary of the plugin's results
 *   Errors: A list of violations reported by this plugin. The tab marker also
 *           contains the number of errors listed
 */

var $ = require("jquery");
var template = require("./template.handlebars");

require("./style.less");

class InfoPanel {
    constructor(title="Plugin") {
        this.title = title;
        this.about = null;
        this.summary = null;
        this.errors = [];

        this.$el = null;
    }

    /**
     * Sets the title of the info panel
     * (chainable)
     */
    setTitle(title) {
        this.title = title;
        return this;
    }

    /**
     * Sets the contents of the about section as HTML
     * (chainable)
     */
    setAbout(about) {
        this.about = about;
        return this;
    }

    /**
     * Sets the contents of the summary section as HTML
     * (chainable)
     */
    setSummary(summary) {
        this.summary = summary;
        return this;
    }

    /**
     * Adds an error to the errors tab. Also receives a callback to be
     * fired off when the error is hovered in the info panel.
     * (chainable)
     */
    addError(error, callback) {
        this.errors.push({error, callback});
        return this;
    }

    render() {
        this.$el = $(template({
            title: this.title,
        }));

        let addTab = (title, html) => {
            // Create and append a tab marker
            let $tab = $("<li>").addClass("tota11y-info-tab");
            let $tabAnchor = $("<a>")
                .addClass("tota11y-info-tab-anchor")
                .prop("href", "#")
                .text(title);
            $tab.append($tabAnchor);
            this.$el.find(".tota11y-info-tabs").append($tab);

            // Create and append the tab content
            let $section = $("<div>")
                .addClass("tota11y-info-section")
                .html(html);
            this.$el.find(".tota11y-info-sections").append($section);

            // Register events
            $tab.on("activate", () => {
                $(".tota11y-info-tab.active").removeClass("active");
                $(".tota11y-info-section.active").removeClass("active");

                $tab.addClass("active");
                $section.addClass("active");
            });

            $tabAnchor.on("click", (e) => {
                e.preventDefault();
                $tab.trigger("activate");
            });

            return $tab;
        };

        let $activeTab;
        if (this.about) {
            $activeTab = addTab("About", this.about);
        }

        if (this.summary) {
            $activeTab = addTab("Summary", this.summary);
        }

        if ($activeTab) {
            $activeTab.trigger("activate");
        }

        // TODO: Add errors and attach events

        $("body").append(this.$el);
    }

    destroy() {
        this.$el.remove();
    }
}

module.exports = InfoPanel;
