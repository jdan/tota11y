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

let errorLabelTemplate = require("./error-label.handlebars");
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
            .addClass("tota11y")    // tota11y base class for styling
            .addClass(ANNOTATION_CLASS)
            .addClass(className)
            .css($el.position())
            .data({$el});

        // Append an object to the queue. We'll add the annotation to the DOM
        // later to reduce reflows.
        queue.push({
            $annotation: $annotation,
            $parent: $el.offsetParent()
        });

        return $annotation;
    };

    // A queue of {$annotation, $parent}'s that is populated by
    // `createAnnotation` and emptied by the `render()` method.
    //
    // Annotations are queued to reduce reflows.
    let queue = [];

    // To maintain a high framerate, we'll only render `RENDER_CHUNK_SIZE`
    // annotations per frame.
    //
    // NOTE: A value of "20" consistently hits 60fps on facebook.com
    const RENDER_CHUNK_SIZE = 20;

    // Mount all annotations to the DOM in sequence. This is done by
    // picking items off the queue, where each item consists of the
    // annotation and the node to which we'll append it.
    function render() {
        for (let i = 0; queue.length > 0 && i < RENDER_CHUNK_SIZE; i++) {
            let item = queue.shift();
            item.$parent.append(item.$annotation);
        }

        window.requestAnimationFrame(render);
    }
    window.requestAnimationFrame(render);

    // Handle resizes by repositioning all annotations in bulk
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
        errorLabel($el, expanded, labelText=$el.prop("tagName").toLowerCase()) {
            let innerHtml = errorLabelTemplate({
                text: labelText,
                detail: expanded
            });

            return this.label($el)
                .addClass("tota11y-label-error")
                .html(innerHtml);
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
