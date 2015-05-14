/**
 * A plugin to visualize alt-text for images.
 */

var $ = require("jquery");
var Plugin = require("../base");
var annotate = require("../shared/annotate");

require("./style.less");

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
                    .addClass("tota11y-alt-text")
                    .text($(this).prop("alt")));
        });
    }

    cleanup() {
        $(".tota11y-highlight").remove();
    }
}

module.exports = AltText;
