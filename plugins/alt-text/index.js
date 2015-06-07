/**
 * A plugin to check for valid alternative representations for images
 */

let $ = require("jquery");
let Plugin = require("../base");
let annotate = require("../shared/annotate")("alt-text");

let errorTemplate = require("./error.handlebars");

class AltTextPlugin extends Plugin {
    getTitle() {
        return "Image alt-text";
    }

    getDescription() {
        return "Annotates images without alt text";
    }

    run() {
        $("img").each((i, el) => {
            let $el = $(el);

            if ($el.attr("alt") === "" || $el.attr("role") === "presentation") {
                // Presentation images are fine.
                //
                // We'll label them as "decorative" to point out to users
                // that they do not explicitly convey information.
                annotate.label($el, "&#x2713; decorative")
                    .addClass("tota11y-label-success");

            } else if ($el.attr("alt")) {
                // Image has proper alt text
                // TODO: aria-label, etc from axs.properties.alternative
                annotate.label($el, "&#x2713;")
                    .addClass("tota11y-label-success");

            } else {
                annotate.label($el, "&#x2717;")
                    .addClass("tota11y-label-error");

                this.error("Image is missing alt text", errorTemplate(), $el);
            }
        });
    }

    cleanup() {
        annotate.removeAll();
    }
}

module.exports = AltTextPlugin;
