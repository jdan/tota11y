/**
 * Allows users to see what screen readers would see.
 */

let $ = require("jquery");
let annotate = require("../shared/annotate")("a11y-wand");
let Plugin = require("../base");

require("./style.less");

class A11yTextWand extends Plugin {
    getTitle() {
        return "Screen Reader Wand";
    }

    getDescription() {
        return "Hover over elements to view them as a screen reader would";
    }

    run() {
        $(document).on("mousemove.wand", function(e) {
            let element = document.elementFromPoint(e.clientX, e.clientY);

            let textAlternative = axs.properties.findTextAlternatives(
                element, {});

            $(".tota11y-outlined").removeClass("tota11y-outlined");
            $(element).addClass("tota11y-outlined");

            if (!textAlternative) {
                annotate.summary(
                    <i className="tota11y-nothingness">
                        No text visible to a screen reader
                    </i>
                );
            } else {
                annotate.summary(textAlternative);
            }
        });
    }

    cleanup() {
        $(".tota11y-outlined").removeClass("tota11y-outlined");
        $(document).off("mousemove.wand");
        annotate.removeAll();
    }
}

module.exports = A11yTextWand;
