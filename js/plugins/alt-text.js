/**
 * A plugin to visualize alt-text for images.
 */

var $ = require("jquery");
var Plugin = require("./plugin-base");

class AltText extends Plugin {
    getTitle() {
        return "Image alt-text";
    }

    getDescription() {
        return "Displays alt-text in place of images";
    }

    run() {
        $("img").each(function() {
            $(this).fadeOut(1000, () => {
                var $altText = $("<span>")
                    .addClass("tota11y-alt-text")
                    .text($(this).prop("alt"));

                $(this).after($altText);
            });
        });
    }

    cleanup() {
        $(".tota11y-alt-text").remove();
        $("img").fadeIn(1000);
    }
}

module.exports = AltText;