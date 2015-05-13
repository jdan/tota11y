/**
 * A plugin to label all ARIA landmark roles
 */

var $ = require("jquery");
var Plugin = require("../base");
var annotate = require("../shared/annotate");

const LABEL_CLASS = "tota11y-landmark-label";

class LandmarksPlugin extends Plugin {
    getTitle() {
        return "Landmarks"
    }

    getDescription() {
        return "Labels all ARIA landmarks"
    }

    run() {
        // Theoretically this could be written in pure CSS, if we were able
        // to consistently place the label on top of the container with the
        // role set.
        //
        // For now, we'll place the label with JavaScript.

        const $regions = $("[role]");
        $regions.each(function() {
            annotate.label($(this), LABEL_CLASS, $(this).attr("role"));
        });
    }

    cleanup() {
        // Remove all labels
        $("." + LABEL_CLASS).remove();
    }
}

module.exports = LandmarksPlugin;
