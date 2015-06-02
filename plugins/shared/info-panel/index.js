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

let $ = require("jquery");
let annotate = require("../annotate")("info-panel");

let template = require("./template.handlebars");
let errorTemplate = require("./error.handlebars");
let tabTemplate = require("./tab.handlebars");
require("./style.less");

const INITIAL_PANEL_MARGIN_PX = 10;

class InfoPanel {
    constructor(title) {
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
     * Adds an error to the errors tab. Also receives a jQuery element to
     * highlight on hover.
     * (chainable)
     */
    addError(title, description, $el) {
        this.errors.push({title, description, $el});
        return this;
    }

    _addTab(title, html) {
        // Create and append a tab marker
        let $tab = $(tabTemplate({title}));
        this.$el.find(".tota11y-info-tabs").append($tab);

        // Create and append the tab content
        let $section = $("<div>")
            .addClass("tota11y-info-section")
            .html(html);
        this.$el.find(".tota11y-info-sections").append($section);

        // Register an "activate" event for the tab, which switches the
        // tab's associated content to be visible, and changes the
        // appearance of the newly-active tab marker
        $tab.on("activate", () => {
            this.$el.find(".tota11y-info-tab.active")
                .removeClass("active");
            this.$el.find(".tota11y-info-section.active")
                .removeClass("active");

            $tab.addClass("active");
            $section.addClass("active");
        });

        // Activate the tab when its anchor is clicked
        $tab.on("click", (e) => {
            e.preventDefault();
            $tab.trigger("activate");
        });

        return $tab;
    }

    /**
     * Positions the info panel and sets up event listeners to make the
     * panel draggable
     */
    initPositioning() {
        let panelRightPx = INITIAL_PANEL_MARGIN_PX;
        let panelBottomPx = INITIAL_PANEL_MARGIN_PX;

        // Wire up the dismiss button
        this.$el.find(".tota11y-info-dismiss-trigger").click((e) => {
            e.preventDefault();
            this.destroy();
        });

        // Append the info panel to the body. In reality we'll likely want
        // it directly adjacent to the toolbar.
        $("body").append(this.$el);

        // Wire up draggable surface
        let $draggable = this.$el.find(".tota11y-info-title");
        let isDragging = false;

        // Variables for the starting positions of the mouse and panel
        let initMouseX, initMouseY;
        let initPanelRight, initPanelBottom;

        $draggable
            .on("mousedown", (e) => {
                e.preventDefault();

                // Start dragging, and record initial mouse and panel
                // positions
                isDragging = true;

                initMouseX = e.pageX;
                initMouseY = e.pageY;

                initPanelRight = panelRightPx;
                initPanelBottom = panelBottomPx;
            })
            .on("mouseup", (e) => {
                e.preventDefault();
                isDragging = false;
            });

        $(window).on("mousemove", (e) => {
            if (!isDragging) {
                return;
            }
            e.preventDefault();

            let deltaX = e.pageX - initMouseX;
            let deltaY = e.pageY - initMouseY;

            panelRightPx = initPanelRight - deltaX;
            panelBottomPx = initPanelBottom - deltaY;

            this.$el.css({
                right: panelRightPx,
                bottom: panelBottomPx
            });
        });

        this.$el.css({
            right: panelRightPx,
            bottom: panelBottomPx
        });
    }

    render() {
        // Destroy the existing info panel to prevent double-renders
        this.$el && this.$el.remove();

        let hasContent = false;

        this.$el = $(template({
            title: this.title,
        }));

        // Add the appropriate tabs based on which information the info panel
        // was provided, then highlight the most important one.
        let $activeTab;
        if (this.about) {
            $activeTab = this._addTab("About", this.about);
        }

        if (this.summary) {
            $activeTab = this._addTab("Summary", this.summary);
        }

        if (this.errors.length > 0) {
            let $errors = $("<ul>").addClass("tota11y-info-errors");

            this.errors.forEach((error, i) => {
                let $error = $(errorTemplate(error));
                $errors.append($error);

                // Wire up the expand/collapse trigger
                let $trigger = $error.find(".tota11y-info-error-trigger");
                $trigger.click((e) => {
                    e.preventDefault();
                    $trigger.toggleClass("tota11y-collapsed");
                });

                // Wire up the scroll-to-error button
                let $scroll = $error.find(".tota11y-info-error-scroll");
                $scroll.click((e) => {
                    e.preventDefault();
                    $(document).scrollTop(error.$el.offset().top - 80);
                });

                // Expand the first violation
                if (i === 0) {
                    $trigger.toggleClass("tota11y-collapsed");
                }

                // Highlight the violating element on hover/focus. We do it
                // for both $trigger and $scroll to allow users to see the
                // highlight when scrolling to the element with the button.
                annotate.toggleHighlight(error.$el, $trigger);
                annotate.toggleHighlight(error.$el, $scroll);
            });

            $activeTab = this._addTab("Errors", $errors);

            // Add a small badge next to the tab title
            let $badge = $("<div>")
                .addClass("tota11y-info-error-count")
                .text(this.errors.length);

            $activeTab.find(".tota11y-info-tab-anchor").append($badge);
        }

        if ($activeTab) {
            $activeTab.trigger("activate");
            // hasContent is technically coupled to $activeTab, since if there
            // is no $activeTab then there is no content. This behavior may
            // change in the future.
            hasContent = true;
        }

        if (hasContent) {
            this.initPositioning();
        }

        return this.$el;
    }

    destroy() {
        // Reset contents
        this.about = null;
        this.summary = null;
        this.errors = [];

        this.$el && this.$el.remove();
    }
}

module.exports = InfoPanel;
