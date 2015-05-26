/**
 * A plugin to identify and validate heading tags (<h1>, <h2>, etc.)
 */

let $ = require("jquery");
let Plugin = require("../base");
let annotate = require("../shared/annotate")("headers");
let InfoPanel = require("../shared/info-panel");

let outlineItemTemplate = require("./outline-item.handlebars");
require("./style.less");

const ERRORS = {
    FIRST_NOT_H1: {
        title: "First heading is not an <h1>"
    },

    MULTIPLE_H1: {
        title: "<h1> used when one is already present"
    },

    // This error accepts two arguments to display a relevant error message
    NONCONSECUTIVE_HEADER(prevLevel, currLevel) {
        let _tag = (level) => `<code>&lt;h${level}&gt;</code>`;
        let description = `
            This document contains an ${_tag(currLevel)} tag directly
            following an ${_tag(prevLevel)}. In order to maintain a consistent
            outline of the page for assistive technologies, reduce the gap in
            the heading level by upgrading the this tag to an
            ${_tag(prevLevel+1)}`;

        // Suggest upgrading the tag to the same level as `prevLevel` iff
        // `prevLevel` is not 1
        if (prevLevel !== 1) {
            description += ` or ${_tag(prevLevel)}`;
        }

        return {
            title: `Nonconsecutive heading level used
                    (h${prevLevel} &rarr; h${currLevel})`,
            description: description + "."
        };
    }
};

class HeadingsPlugin extends Plugin {
    getTitle() {
        return "Headings";
    }

    getDescription() {
        return "Highlights headings (<h1>, <h2>, etc) and order violations";
    }

    // Computes an outline of the page and reports any violations.
    //
    // TODO: We'll want to use an outline algorithm as defined here:
    // http://www.w3.org/html/wg/drafts/html/master/semantics.html#outlines
    outline($headings) {
        let $outline = $("<div>").addClass("tota11y-heading-outline");

        let prevLevel;
        let h1Count = 0;
        $headings.each((i, el) => {
            let $el = $(el);
            let level = +$el.prop("tagName").slice(1);
            let error = null;

            // Label the heading tag
            annotate.label($el);

            if (level === 1) {
                h1Count++;
            }

            // Check for any violations
            // NOTE: These violations do not overlap, but as we add more, we
            // may want to separate the conditionals here to report multiple
            // errors on the same tag.
            if (i === 0 && level !== 1) {
                error = ERRORS.FIRST_NOT_H1;
            } else if (h1Count > 1) {
                error = ERRORS.MULTIPLE_H1;
            } else if (prevLevel && level - prevLevel > 1) {
                error = ERRORS.NONCONSECUTIVE_HEADER(prevLevel, level);
            }

            // Render the entry in the outline for the "Summary" tab
            let $item = $(outlineItemTemplate({
                level: level,
                text: $el.text()
            })).css({
                "margin-left": 20 * (level - 1)
            });
            $outline.append($item);

            if (error) {
                $item.addClass("level-error");
                this.panel.addError(error.title, error.description, $el);
            }

            prevLevel = level;
        });

        return $outline;
    }

    run() {
        this.panel = new InfoPanel(this.getTitle());
        let $headings = $("h1, h2, h3, h4, h5, h6");
        let $outline = this.outline($headings);

        this.panel.setSummary($outline).setAbout("Headings plugin").render();
    }

    cleanup() {
        annotate.removeAll();
        this.panel.destroy();
    }
}

module.exports = HeadingsPlugin;
