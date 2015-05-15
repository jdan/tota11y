/**
 * Utility functions to annotate particular site elements.
 *
 * Annotations are namespaced, meaning you would normally include this
 * package like so:
 *
 *     var annotate = require("./annotate")("headers");
 *
 * This allows plugins to easily maintain their annotations, rather than
 * keeping track of an extra class name elsewhere.
 */

var $ = require("jquery");

require("./style.less");

module.exports = (namespace) => {
    return {
        // Places a small label in the top left corner of a given jQuery element.
        // By default, this label contains the elements tagName.
        label($el, text=$el.prop("tagName").toLowerCase()) {
            let { top, left } = $el.position();

            let $tag = $("<span>")
                .addClass("tota11y-label")
                .addClass("tota11y-label-" + namespace)
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
        highlight($el) {
            let { top, left } = $el.position();

            let $highlight = $("<div>")
                .addClass("tota11y-highlight")
                .addClass("tota11y-highlight-" + namespace)
                .css({
                    top: top,
                    left: left,
                    width: $el.outerWidth(true),  // include margins
                    height: $el.outerHeight(true)
                });

            $el.offsetParent().append($highlight);
            return $highlight;
        },

        removeAll() {
            $(".tota11y-highlight-" + namespace).remove();
            $(".tota11y-label-" + namespace).remove();
        }
    };
};
