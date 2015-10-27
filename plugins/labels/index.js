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
                annotate.error($el, "", title, $(this.errorMessage($el)));
            });
        }
    }

    cleanup() {
        annotate.removeAll();
    }
}

module.exports = LabelsPlugin;
