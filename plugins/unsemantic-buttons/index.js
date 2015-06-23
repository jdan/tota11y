/**
 * A plugin to identify unlabeled inputs
 */

let $ = require("jquery");
let Plugin = require("../base");
let annotate = require("../shared/annotate")("unsemantic-buttons");
let audit = require("../shared/audit");

let titleTemplate = require("./title.handlebars");
let descriptionTemplate = require("./description.handlebars");

class UnsemanticButtonsPlugin extends Plugin {
    getTitle() {
        return "Unsemantic buttons";
    }

    getDescription() {
        return "Highlights buttons which may not be keyboard accessible";
    }

    reportError(el) {
        let isFocusable = +el.getAttribute("tabindex") > -1;

        let listeners = getEventListeners(el);
        let hasKeyEvent = ("keydown" in listeners) ||
                          ("keyup" in listeners) ||
                          ("keypress" in listeners);

        let options = {
            // a's with an href will have been filtered out by this point
            missingHref: el.tagName.toLowerCase() === "a",

            focusableAndHasKeyEvent: isFocusable && hasKeyEvent,

            missingButtonRole:
                el.getAttribute("role").toLowerCase() !== "button",
        };

        // TODO: There seems to be a pattern developing here
        let title = titleTemplate(options);
        let description = descriptionTemplate(options);

        let error = this.error(title, description, $(el));
        annotate.errorLabel($(el), title, "", error);
    }

    run() {
        $("*").each((i, el) => {
            // Semantic buttons will be keyboard accessible by default if
            // they have a click handler
            if (axs.utils.isElementImplicitlyFocusable(el)) {
                return;
            }

            if (!("click" in window.getEventListeners(el))) {
                return;
            }

            // At this point we are dealing with an unsemantic button
            this.reportError(el);
        });
    }

    cleanup() {
        annotate.removeAll();
    }
}

module.exports = UnsemanticButtonsPlugin;
