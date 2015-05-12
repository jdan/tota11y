/**
 * Utility functions to annotate particular site elements.
 */

var $ = require("jquery");

require("./style.less");

module.exports = {
    label($el, className, text=$el.prop("tagName").toLowerCase()) {
        var { top, left } = $el.position();

        var $tag = $("<span>")
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
        var { top, left } = $el.position();

        var $highlight = $("<div>")
            .addClass("tota11y-highlight")
            .addClass(className)
            .css({
                top: top + parseFloat($el.css("margin-top")),
                left: left + parseFloat($el.css("margin-left")),
                width: $el.width(),
                height: $el.height()
            });

        $("body").append($highlight);
        return $highlight;
    },

    highlightText($el, className) {
        var textNode = $el[0].firstChild;
        var range = document.createRange();
        range.selectNodeContents(textNode);

        var { top, bottom, left, right } = range.getBoundingClientRect();

        var $textHighlight = $("<div>")
            .addClass("tota11y-highlight")
            .addClass(className)
            .css({
                top: top + $(window).scrollTop(),   // no range .position :(
                left: left + $(window).scrollLeft(),
                width: right - left,
                height: bottom - top
            });

        $("body").append($textHighlight);
        return $textHighlight;
    }
};
