/**
 * A plugin to visualize alt-text for images.
 */

var $ = require("jquery");
var Plugin = require("../base");
var annotate = require("../shared/annotate")("alt-text");

require("./style.less");

class AltTextPlugin extends Plugin {
    getTitle() {
        return "Image alt-text";
    }

    getDescription() {
        return "Displays alt-text in place of images";
    }

    run() {
        $("img").each(function() {
            var $highlight = annotate.highlight($(this));
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
        annotate.removeAll();
    }
}

module.exports = AltTextPlugin;
