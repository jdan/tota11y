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
            var $highlight = annotate.highlight($(this), "tota11y-alt-text");
            var altText = $(this).prop("alt");
            var $inner = $("<div>").addClass("highlight-inner");

            if (altText) {
                $inner.text(altText);
            } else {
                $inner.addClass("header-violation").text("!");
            }

            $highlight.append($inner);
        });
    }

    cleanup() {
        $(".tota11y-highlight").remove();
    }
}

module.exports = AltText;
