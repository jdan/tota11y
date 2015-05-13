/**
 * Utility functions to annotate particular site elements.
 */

var $ = require("jquery");

require("./style.less");

module.exports = {
    label($el, className, text=$el.prop("tagName").toLowerCase()) {
        let { top, left } = $el.position();

        let $tag = $("<span>")
            .addClass("tota11y-label")
            .addClass(className)
            .css({
                top: top + parseFloat($el.css("margin-top")),
                left: left + parseFloat($el.css("margin-left"))
            })
            .text(text);

        $("body").append($tag);
        return $tag;
    },

    highlight($el, className) {
        let { top, bottom, left, right } = $el[0].getBoundingClientRect();

        let $highlight = $("<div>")
            .addClass("tota11y-highlight")
            .addClass(className)
            .css({
                top: top + $(window).scrollTop(),
                left: left + $(window).scrollLeft(),
                width: right - left,
                height: bottom - top
            });

        $("body").append($highlight);
        return $highlight;
    }
};
