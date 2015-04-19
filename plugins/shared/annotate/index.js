/**
 * Utility functions to annotate particular site elements.
 */

var $ = require("jquery");

require("./style.less");

module.exports = {
    label($el, text=$el.prop("tagName").toLowerCase()) {
        var { top, left } = $el.position();

        var $tag = $("<span>")
            .addClass("tota11y-tag")
            .css({
                top: top + parseFloat($el.css("margin-top")),
                left: left + parseFloat($el.css("margin-left"))
            })
            .text(text);

        $("body").append($tag);
        return $tag;
    },

    highlight($el, color="blue", opacity=0.2) {
        var { top, left } = $el.position();

        var $highlight = $("<div>")
            .addClass("tota11y-highlight")
            .css({
                top: top + parseFloat($el.css("margin-top")),
                left: left + parseFloat($el.css("margin-left")),
                width: $el.width(),
                height: $el.height(),
                backgroundColor: color,
                opacity: opacity
            });

        $("body").append($highlight);
        return $highlight;
    },

    highlightText($el, color="blue", opacity=0.2) {
        var textNode = $el[0].firstChild;
        var range = document.createRange();
        range.selectNodeContents(textNode);

        var { top, bottom, left, right } = range.getBoundingClientRect();

        var $textHighlight = $("<div>")
            .addClass("tota11y-highlight")
            .css({
                top: top + $(window).scrollTop(),   // no range .position :(
                left: left + $(window).scrollLeft(),
                width: right - left,
                height: bottom - top,
                backgroundColor: color,
                opacity: opacity
            });

        $("body").append($textHighlight);
        return $textHighlight;
    }
};
