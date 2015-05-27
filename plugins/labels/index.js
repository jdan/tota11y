/**
 * A plugin to identify unlabeled inputs
 */

let $ = require("jquery");
let Plugin = require("../base");
let annotate = require("../shared/annotate")("labels");
let audit = require("../shared/audit");

let errorTemplate = require("./error-template.handlebars");

class LabelsPlugin extends Plugin {
    getTitle() {
        return "Labels";
    }

    getDescription() {
        return "Identifies inputs with missing labels";
    }

    errorMessage($el) {
        return errorTemplate({
            placeholder: $el.prop("placeholder"),
            id: $el.prop("id"),
            tagName: $el.prop("tagName").toLowerCase()
        });
    }

    run() {
        let result = audit("controlsWithoutLabel");

        if (result.result === "FAIL") {
            result.elements.forEach((element) => {
                let $el = $(element);
                let title = "Input is missing a label";

                annotate.label($el, "!!")
                    .addClass("tota11y-label-error")
                    .attr("data-expanded", title);

                this.error(title, this.errorMessage($el), $el);
            });
        }
    }

    cleanup() {
        annotate.removeAll();
    }
}

module.exports = LabelsPlugin;
