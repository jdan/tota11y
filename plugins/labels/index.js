/**
 * A plugin to identify unlabeled inputs
 */

let $ = require("jquery");
let Plugin = require("../base");
let annotate = require("../shared/annotate")("labels");
let audit = require("../shared/audit");
let InfoPanel = require("../shared/info-panel");

let errorTemplate = require("./error-template.handlebars");
require("./style.less");

const LABEL_CLASS = "tota11y-label-error";

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

                annotate.label($el, "!!").addClass(LABEL_CLASS);
                this.error(
                    "Input is missing a label",
                    this.errorMessage($el),
                    $el);
            });
        }
    }

    cleanup() {
        annotate.removeAll();
    }
}

module.exports = LabelsPlugin;
