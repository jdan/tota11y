/**
 * A plugin to identify unclear link text such as "more" and "click here,"
 * which can make for a bad experience when using a screen reader
 */

let $ = require("jquery");
let Plugin = require("../base");
let annotate = require("../shared/annotate")("link-text");
let audit = require("../shared/audit");

class LinkTextPlugin extends Plugin {
    getTitle() {
        return "Link text";
    }

    getDescription() {
        return `
            Identifies links that may be confusing when read by a screen
            reader
        `;
    }

    run() {
        let test = audit("linkWithUnclearPurpose");

        if (test.result === "FAIL") {
            test.elements.forEach((el, i) => {
                let $el = $(el);
                let title = "Link text is unclear";
                let description = `
                    The text <i>"${$el.text()}"</i> is unclear without context
                    and may be confusing to screen readers. Consider
                    rearranging the <code>&lt;a&gt;&lt;/a&gt;</code> tags or
                    including special screen reader text.
                `;
                // TODO: A "show me how" link may be even more helpful

                annotate.errorLabel($el, "This text is unclear", "!!");
                this.error(title, description, $el);
            });
        }
    }

    cleanup() {
        annotate.removeAll();
    }
}

module.exports = LinkTextPlugin;
