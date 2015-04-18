/**
 * A plugin to visualize alt-text for images.
 */

var $ = require("jquery");
var Plugin = require("./plugin-base");
var annotate = require("./shared/annotate");

class AltText extends Plugin {
    getTitle() {
        return "Image alt-text";
    }

    getDescription() {
        return "Displays alt-text in place of images";
    }

    run() {
        $("img").each(function() {
            var $highlight = annotate.highlight($(this), "black", 1.0);
            $highlight.append(
                $("<div>")
                    .css({ color: "white" })
                    .text($(this).prop("alt")));
        });
    }

    cleanup() {
        $(".tota11y-highlight").remove();
    }
}

module.exports = AltText;
