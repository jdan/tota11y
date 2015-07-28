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
            placeholder: $el.attr("placeholder"),
            id: $el.attr("id"),
            tagName: $el.prop("tagName").toLowerCase()
        });
    }

    run() {
        let {result, elements} = audit("controlsWithoutLabel");

        if (result === "FAIL") {
            elements.forEach((element) => {
                let $el = $(element);
                let title = "Input is missing a label";

                // Place an error label on the element and register it as an
                // error in the info panel
                let entry = this.error(title, $(this.errorMessage($el)), $el);
                annotate.errorLabel($el, "", title, entry);
            });
        }
    }

    cleanup() {
        annotate.removeAll();
    }
}

module.exports = LabelsPlugin;
