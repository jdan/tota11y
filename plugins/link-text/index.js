/**
 * A plugin to identify unclear link text such as "more" and "click here,"
 * which can make for a bad experience when using a screen reader
 */

let $ = require("jquery");
let Plugin = require("../base");
let annotate = require("../shared/annotate")("link-text");

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
        let stopWords = [
            "click", "tap", "go", "here", "learn", "more", "this", "page",
            "link", "about"
        ];
        // Generate a regex to match each of the stopWords
        let stopWordsRE = new RegExp(`\\b(${stopWords.join("|")})\\b`, "ig");

        textContent = textContent
            // Strip leading non-alphabetical characters
            .replace(/[^a-zA-Z ]/g, "")
            // Remove the stopWords
            .replace(stopWordsRE, "");

        // Return whether or not there is any text left
        return textContent.trim() !== "";
    }

    /**
     * Checks whether or not the text content of an element (including things
     * like `aria-label`) is unclear.
     */
    validateTextContent(el) {
        let extractedText = $.axs.properties.getTextFromDescendantContent(el);
        return {
            extractedText: extractedText,
            result: this.isDescriptiveText(extractedText),
        };
    }

    /**
     * Checks if an image has descriptive alt text. This is used to determine
     * whether or not image links (<a> tags with a single <img> descendant)
     * are unclear.
     */
    validateAltText(el) {
        let altText = el.getAttribute("alt");
        return {
            extractedText: altText,
            result: this.isDescriptiveText(altText),
        };
    }

    reportError($el, description, content) {
        let entry = this.error("Link text is unclear", $(description), $el);
        annotate.errorLabel($el, "",
            `Link text "${content}" is unclear`, entry);
    }

    run() {
        $("a").each((i, el) => {
            let $el = $(el);

            // Ignore the tota11y UI
            if ($el.parents(".tota11y").length) {
                return;
            }

            // If this anchor contains a single image, we will test the
            // clarity of that image's alt text.
            if ($el.find("> img").length === 1) {
                let report = this.validateAltText($el.find("> img")[0]);

                if (!report.result) {
                    let description = `
                        The alt text for this link's image,
                        <i>"${report.extractedText}"</i>, is unclear without
                        context and may be confusing to screen readers.
                        Consider providing more detailed alt text.
                    `;

                    this.reportError($el, description, report.extractedText);
                }
            } else {
                let report = this.validateTextContent(el);

                if (!report.result) {
                    let description = `
                        The text <i>"${report.extractedText}"</i> is unclear
                        without context and may be confusing to screen readers.
                        Consider rearranging the <code>&lt;a&gt;&lt;/a&gt;
                        </code> tags or including special screen reader text.
                    `;

                    this.reportError($el, description, report.extractedText);
                }
            }
        });
    }

    cleanup() {
        annotate.removeAll();
    }
}

module.exports = LinkTextPlugin;
