/**
 * A plugin to label different levels of contrast on the page, and highlight
 * those with poor contrast while suggesting alternatives.
 */

let $ = require("jquery");
let Plugin = require("../base");
let annotate = require("../shared/annotate")("labels");

class ContrastPlugin extends Plugin {
    getTitle() {
        return "Contrast";
    }

    getDescription() {
        return "Labels elements with insufficient contrast";
    }

    run() {
        // A set of fg/bg color pairs that we have already seen so that we
        // do not report them more than once
        let seenColors = new Set();

        $("*").each((i, el) => {
            // Only check elements with a direct text descendant
            if (!axs.properties.hasDirectTextDescendant(el)) {
                return;
            }

            // Ignore elements that are part of the tota11y UI
            if ($.contains($(".tota11y")[0], el)) {
                return;
            }

            // Ignore invisible elements
            if (axs.utils.elementIsTransparent(el) ||
                axs.utils.elementHasZeroArea(el)) {
                    return;
            }

            let style = window.getComputedStyle(el);
            let fgColor = axs.utils.getFgColor(style, el);
            let bgColor = axs.utils.getBgColor(style, el);
            let contrastRatio = axs.utils.calculateContrastRatio(
                fgColor, bgColor);

            if (axs.utils.isLowContrast(contrastRatio, style)) {
                // Suggest colors
                // TODO: Intelligently use fg/bg dependending on context
                let suggestedBgColor =
                    axs.utils.suggestColors(
                        bgColor, fgColor, contrastRatio, style).AA.bg;

                annotate.errorLabel(
                    $(el),
                    "This contrast is insufficient at this size. Use a " +
                    "background color of " + suggestedBgColor + " instead",
                    contrastRatio.toFixed(2));
            } else {
                // Build a value for our `seenColors` set and report the color
                // if we have not seen it yet
                let entry = axs.utils.colorToString(fgColor) + "/" +
                            axs.utils.colorToString(bgColor);

                if (!seenColors.has(entry)) {
                    annotate
                        .label($(el), contrastRatio.toFixed(2))
                        .addClass("tota11y-label-success");
                    seenColors.add(entry);
                }
            }
        });
    }

    cleanup() {
        annotate.removeAll();
    }
}

module.exports = ContrastPlugin;
