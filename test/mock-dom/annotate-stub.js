/**
 * A stub for the annotations module which records annotations but does not
 * attempt to place them in the DOM.
 *
 * In the future, we may want to ditch this stub and instead incorporate
 * features like checking if an element is labeled right from the annotations
 * module.
 */

module.exports = () => {
    return {
        label($el, text) {
            $el.data({
                "has-label": true,
                "label-text": text,
            });

            return $el;
        },

        errorLabel($el, text, expanded) {
            $el.data({
                "has-label": true,
                "has-error-label": true,
                "label-text": text,
                "expanded-text": expanded,
            });

            return $el;
        },
    };
};
