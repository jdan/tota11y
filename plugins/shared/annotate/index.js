/**
 * Utility functions to annotate particular site elements.
 */

var $ = require("jquery");

require("./style.less");

module.exports = {
    // Places a small label in the top left corner of a given jQuery element.
    // By default, this label contains the elements tagName.
    label($el, className, text=$el.prop("tagName").toLowerCase()) {
        let { top, left } = $el.position();

        let $tag = $("<span>")
            .addClass("tota11y-label")
            .addClass(className)
            .css({
                top: top,
                left: left
            })
            .text(text);

        $el.offsetParent().append($tag);
        return $tag;
    },

    // Highlights a given jQuery element by placing a translucent rectangle
    // directly over it.
    highlight($el, className) {
        let { top, left } = $el.position();

        let $highlight = $("<div>")
            .addClass("tota11y-highlight")
            .addClass(className)
            .css({
                top: top,
                left: left,
                width: $el.outerWidth(true),  // include margins
                height: $el.outerHeight(true)
            });

        $el.offsetParent().append($highlight);
        return $highlight;
    }
};
