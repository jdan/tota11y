/**
 * A plugin to identify unlabeled inputs
 */

let $ = require("jquery");
let camelCase = require("lodash.camelcase");
let difference = require("lodash.difference");
let keys = require("lodash.keys");
let pick = require("lodash.pick");
let Plugin = require("../base");
let annotate = require("../shared/annotate")("unsemantic-buttons");

// An array of style attributes which provide a visual indication of
// focus when changed
const VISUAL_INDICATORS = [
    function outline(style, focusStyle) {
        let hasFocusOutline = focusStyle.outlineStyle !== "none" &&
            parseFloat(focusStyle.outlineWidth) !== "0";

        return style.outline !== focusStyle.outline &&
               hasFocusOutline;
    },

    function textDecoration(style, focusStyle) {
        return style.textDecoration !== focusStyle.textDecoration;
    }
];

class FocusStylesPlugin extends Plugin {
    getTitle() {
        return "Focus styles";
    }

    getDescription() {
        return "Highlights input elements which have no focus style";
    }

    run() {
        let activeElement = document.activeElement;

        $("*").each((i, el) => {
            if ($(el).parents(".tota11y").length) {
                return;
            }

            if (!el.hasAttribute("tabIndex") &&
                    !axs.utils.isElementImplicitlyFocusable(el)) {
                return;
            }

            let style = JSON.parse(JSON.stringify(getComputedStyle(el)));
            el.focus();
            let focusStyle = getComputedStyle(el);

            let passes = false;
            VISUAL_INDICATORS.forEach((test) => {
                if (passes) return;

                if (test(style, focusStyle)) {
                    passes = true;
                }
            });

            if (!passes) {
                annotate.errorLabel($(el), "Um", "idk");
            }
        });

        activeElement && activeElement.focus();
    }

    cleanup() {
        annotate.removeAll();
    }
}

module.exports = FocusStylesPlugin;
