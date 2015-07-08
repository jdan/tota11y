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

    /**
     * Slightly modified unclear text checking that has been refactored into
     * a single method to be called with arbitrary strings.
     *
     * Original: https://github.com/GoogleChrome/accessibility-developer-tools/blob/9183b21cb0a02f5f04928f5cb7cb339b6bbc9ff8/src/audits/LinkWithUnclearPurpose.js#L55-67
     */
    isDescriptiveText(textContent) {
        textContent = textContent.replace(/[^a-zA-Z ]/g, '');
        let stopWords = [
            'click', 'tap', 'go', 'here', 'learn', 'more', 'this', 'page',
            'link', 'about'
        ];

        for (let i = 0; i < stopWords.length; i++) {
            let stopwordRE = new RegExp('\\b' + stopWords[i] + '\\b', 'ig');
            textContent = textContent.replace(stopwordRE, '');
            if (textContent.trim() == '')
                return false;
        }

        return true;
    }

    /**
     * Checks whether or not the text content of an element (including things
     * like `aria-label`) is unclear.
     */
    validateTextContent(el) {
        let textContent = $.axs.properties.getTextFromDescendantContent(el);
        return {
            textContent: textContent,
            result: this.isDescriptiveText(textContent),
        };
    }

    /**
     * Checks if an image has descriptive alt text. This is used to determine
     * whether or not image links (<a> tags with a single <img> descendant)
     * are unclear.
     */
    validateAltText(el) {
        let altTextContent = el.getAttribute("alt");
        return {
            textContent: altTextContent,
            result: this.isDescriptiveText(altTextContent),
        };
    }

    reportError($el, unclearText) {
        let description = `
            The text <i>"${unclearText}"</i> is unclear without context and
            may be confusing to screen readers. Consider rearranging the
            <code>&lt;a&gt;&lt;/a&gt;</code> tags or including special screen
            reader text.
        `;
        // TODO: A "show me how" link may be even more helpful

        let entry = this.error(
            "Link text is unclear", description, $el);

        annotate.errorLabel(
            $el, "", `Link text "${unclearText}" is unclear`, entry);
    }

    run() {
        $("a").each((i, el) => {
            let $el = $(el);
            if ($el.parents(".tota11y").length) {
                return;
            }

            let report;
            // If this anchor contains a single image, we will test the
            // clarity of that image's alt text.
            if ($el.find("> img").length === 1) {
                report = this.validateAltText($el.find("> img")[0]);
            } else {
                report = this.validateTextContent(el);
            }

            if (!report.result) {
                this.reportError($el, report.textContent);
            }
        });
    }

    cleanup() {
        annotate.removeAll();
    }
}

module.exports = LinkTextPlugin;
