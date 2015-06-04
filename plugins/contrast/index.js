/**
 * A plugin to label different levels of contrast on the page, and highlight
 * those with poor contrast while suggesting alternatives.
 */

let $ = require("jquery");
let Plugin = require("../base");
let annotate = require("../shared/annotate")("labels");

let titleTemplate = require("./error-title.handlebars");
let descriptionTemplate = require("./error-description.handlebars");

require("./style.less");

class ContrastPlugin extends Plugin {
    getTitle() {
        return "Contrast";
    }

    getDescription() {
        return "Labels elements with insufficient contrast";
    }

    _registerError(options, el) {
        // Suggest colors at an "AA" level
        let suggestedColors = axs.utils.suggestColors(
            options.bgColor,
            options.fgColor,
            options.contrastRatio,
            options.style).AA;

        let templateData = {
            fgColorHex: axs.utils.colorToString(options.fgColor),
            bgColorHex: axs.utils.colorToString(options.bgColor),
            contrastRatio: options.contrastRatio,
            requiredRatio: options.requiredRatio,
            suggestedFgColorHex: suggestedColors.fg,
            suggestedBgColorHex: suggestedColors.bg,
            suggestedColorsRatio: suggestedColors.contrast
        };

        return this.error(
            titleTemplate(templateData),
            descriptionTemplate(templateData),
            $(el));
    }

    run() {
        // A map of fg/bg color pairs that we have already seen to the error
        // entry currently present in the info panel
        let seenColors = {};

        $("*").each((i, el) => {
            // Only check elements with a direct text descendant
            if (!axs.properties.hasDirectTextDescendant(el)) {
                return;
            }

            // Ignore elements that are part of the tota11y UI
            if ($(el).parents(".tota11y").length > 0) {
                return;
            }

            // Ignore invisible elements
            if (axs.utils.elementIsTransparent(el) ||
                axs.utils.elementHasZeroArea(el)) {
                    return;
            }

            let style = getComputedStyle(el);
            let bgColor = axs.utils.getBgColor(style, el);
            let fgColor = axs.utils.getFgColor(style, el, bgColor);
            let contrastRatio = axs.utils.calculateContrastRatio(
                fgColor, bgColor).toFixed(2);

            // Calculate required ratio based on size
            // Using strings to prevent rounding
            let requiredRatio = axs.utils.isLargeFont(style) ?
                "3.0" : "4.5";

            // Build a key for our `seenColors` map and report the color
            // if we have not seen it yet
            let key = axs.utils.colorToString(fgColor) + "/" +
                        axs.utils.colorToString(bgColor) + "/" +
                        requiredRatio;

            if (!axs.utils.isLowContrast(contrastRatio, style)) {
                // For acceptable contrast values, we don't show ratios if
                // they have been presented already
                if (!seenColors[key]) {
                    annotate
                        .label($(el), contrastRatio)
                        .addClass("tota11y-label-success");

                    // Add the key to the seenColors map. We don't have an
                    // error to associate it with, so we'll just give it the
                    // value of `true`.
                    seenColors[key] = true;
                }
            } else {
                if (!seenColors[key]) {
                    // We do not show duplicates in the errors panel, however,
                    // to keep the output from being overwhelming
                    let error = this._registerError(
                        {fgColor, bgColor, contrastRatio, style, requiredRatio},
                        el);

                    seenColors[key] = error;
                }

                // We display errors multiple times for emphasis. Each error
                // will point back to the entry in the info panel for that
                // particular color combination.
                //
                // TODO: The error entry in the info panel will only highlight
                // the first element with that color combination
                annotate.errorLabel(
                    $(el),
                    contrastRatio,
                    "This contrast is insufficient at this size.",
                    seenColors[key]);
            }
        });
    }

    cleanup() {
        annotate.removeAll();
    }
}

module.exports = ContrastPlugin;
