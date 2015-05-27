/**
 * Utility functions to annotate particular site elements.
 *
 * Annotations are namespaced, meaning you would normally include this
 * package like so:
 *
 *     let annotate = require("./annotate")("headers");
 *
 * This allows plugins to easily maintain their annotations, rather than
 * keeping track of an extra class name elsewhere.
 */

let $ = require("jquery");

require("./style.less");

module.exports = (namespace) => {
    // The class that will be applied to any annotation generated in this
    // namespace
    const ANNOTATION_CLASS = "tota11y-annotation-" + namespace;

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

    $(window).resize(() => {
        let $annotations = $("." + ANNOTATION_CLASS);

        // Record the position of each annotation's corresponding element to
        // batch measurements
        let positions = $annotations.map((i, el) => {
            return $(el).data("$el").position();
        });

        // Reposition each annotation (batching invalidations)
        $annotations.each((i, el) => {
            $(el).css({
                top: positions[i].top,
                left: positions[i].left
            });
        });
    });

    return {
        // Places a small label in the top left corner of a given jQuery
        // element. By default, this label contains the element's tagName.
        label($el, text=$el.prop("tagName").toLowerCase()) {
            let $label = createAnnotation($el, "tota11y-label");
            return $label.text(text);
        },

        // Places a special error label on an element that, when hovered,
        // displays an expanded error message
        errorLabel($el, expanded, labelText) {
            return this.label($el, labelText)
                .addClass("tota11y-label-error")
                .attr("data-expanded", expanded);
        },

        // Highlights a given jQuery element by placing a translucent
        // rectangle directly over it
        highlight($el) {
            let $highlight = createAnnotation($el, "tota11y-highlight");
            return $highlight.css({
                width: $el.outerWidth(true),    // include margins
                height: $el.outerHeight(true)
            });
        },

        // Toggles a highlight on a given jQuery element `$el` when `$trigger`
        // is hovered (mouseenter/mouseleave) or focused (focus/blur)
        toggleHighlight($el, $trigger) {
            let $highlight;

            $trigger.on("mouseenter focus", () => {
                if ($highlight) {
                    $highlight.remove();
                }

                $highlight = this.highlight($el);
            });

            $trigger.on("mouseleave blur", () => {
                if ($highlight) {
                    $highlight.remove();
                    $highlight = null;
                }
            });
        },

        removeAll() {
            // Remove all annotations
            $("." + ANNOTATION_CLASS).remove();
        }
    };
};
