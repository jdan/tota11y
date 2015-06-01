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

                // Place an error label on the element and register it as an
                // error in the info panel
                annotate.errorLabel($el, title, "");
                this.error(title, this.errorMessage($el), $el);
            });
        }

        annotate.render();
    }

    cleanup() {
        annotate.removeAll();
    }
}

module.exports = LabelsPlugin;
