/**
 * A plugin to identify unlabeled inputs
 */

let $ = require("jquery");
let Plugin = require("../base");
let annotate = require("../shared/annotate")("focus-styles");

// A collection of tests to determine whether the given `style` and
// `focusStyle` CSSDeclarations have substantial visual differences
const VISUAL_INDICATOR_TESTS = [
    function outline(style, focusStyle) {
        // Fail if there are no differences in the element's outline
        if (style.outline !== focusStyle.outline) {
            return false;
        }

        // A focus outline that is not "none" is only valid if the outline
        // also has a width
        return focusStyle.outlineStyle !== "none" &&
               parseFloat(focusStyle.outlineWidth) !== 0;
    },

    function textDecoration(style, focusStyle) {
        // Fail if the text decoration (e.g. underline) does not change
        return style.textDecoration !== focusStyle.textDecoration;
    },

    function border(style, focusStyle) {
        // Fail if the border does not change
        if (style.border === focusStyle.border) {
            return false;
        }

        // Now we check the top/right/bottom/left borders individually to
        // ensure that (A) the border style is different and (B) the border
        // width is not zero when focused
        if (style.borderTop === focusStyle.borderTop ||
                parseFloat(focusStyle.borderTopWidth) === 0) {
            return false;
        }

        if (style.borderRight === focusStyle.borderRight ||
                parseFloat(focusStyle.borderRightWidth) === 0) {
            return false;
        }

        if (style.borderBottom === focusStyle.borderBottom ||
                parseFloat(focusStyle.borderBottomWidth) === 0) {
            return false;
        }

        if (style.borderLeft === focusStyle.borderLeft ||
                parseFloat(focusStyle.borderLeftWidth) === 0) {
            return false;
        }

        return true;
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
            VISUAL_INDICATOR_TESTS.forEach((test) => {
                if (passes) return;

                if (test(style, focusStyle)) {
                    passes = true;
                }
            });

            if (!passes) {
                annotate.errorLabel($(el), "Um", "idk");
            }
        });

        if (activeElement) {
            activeElement.focus();
        } else {
            document.activeElement.blur();
        }
    }

    cleanup() {
        annotate.removeAll();
    }
}

module.exports = FocusStylesPlugin;
