/**
 * A plugin to label all ARIA landmark roles
 */

let $ = require("jquery");
let Plugin = require("../base");
let annotate = require("../shared/annotate")("landmarks");

class LandmarksPlugin extends Plugin {
    getTitle() {
        return "Landmarks";
    }

    getDescription() {
        return "Labels all ARIA landmarks";
    }

    run() {
        // Theoretically this could be written in pure CSS, if we were able
        // to consistently place the label on top of the container with the
        // role set.
        //
        // For now, we'll place the label with JavaScript.

        const $regions = $("[role]");
        $regions.each(function() {
            annotate.label($(this), $(this).attr("role"));
        });

        annotate.render();
    }

    cleanup() {
        annotate.removeAll();
    }
}

module.exports = LandmarksPlugin;
