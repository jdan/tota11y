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
var debounce = require("lodash.debounce");

require("./style.less");

module.exports = (namespace) => {
    // The class that will be applied to any annotation generated in this
    // namespace
    const ANNOTATION_CLASS = "tota11y-annotation-" + namespace;
    const ANNOTATION_DEBOUNCE_MS = 50;

    // Register a new annotation to a given jQuery element
    let createAnnotation = ($el, className) => {
        // Create a position an annotation relative to its offset parent.
        // We also store the element its annotation so we can reposition when
        // the window resizes.
        let $annotation = $("<div>")
            .addClass(ANNOTATION_CLASS)
            .addClass(className)
            .css($el.position())
            .data({$el});

        // Append the annotation to the element's closest ancestor that is
        // positioned
        $el.offsetParent().append($annotation);

        return $annotation;
    };

    // We do a leading debounce to hide all annotations in this namespace
    $(window).resize(debounce(() => {
        $("." + ANNOTATION_CLASS).addClass("tota11y-hidden");
    }, ANNOTATION_DEBOUNCE_MS, {
        "leading": true,
        "trailing": false
    }));

    $(window).resize(() => {
        let positions = [];
        let $annotations = $("." + ANNOTATION_CLASS);

        // Record the position of each annotation's corresponding element to
        // batch measurements
        $annotations.each((i, el) => {
            positions.push($(el).data("$el").position());
        });

        // Reposition each annotation (batching invalidations)
        $annotations.each((i, el) => {
            $(el).css({
                top: positions[i].top,
                left: positions[i].left
            }).removeClass("tota11y-hidden");
        });
    });

    return {
        // Places a small label in the top left corner of a given jQuery
        // element. By default, this label contains the element's tagName.
        label($el, text=$el.prop("tagName").toLowerCase()) {
            let $label = createAnnotation($el, "tota11y-label");
            return $label.text(text);
        },

        // Highlights a given jQuery element by placing a translucent
        // rectangle directly over it.
        highlight($el) {
            let $highlight = createAnnotation($el, "tota11y-highlight");
            return $highlight.css({
                width: $el.outerWidth(true),    // include margins
                height: $el.outerHeight(true)
            });
        },

        removeAll() {
            // Remove all annotations
            $("." + ANNOTATION_CLASS).remove();
        }
    };
};
