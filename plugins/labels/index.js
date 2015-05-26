/**
 * A plugin to identify unlabeled inputs
 */

let $ = require("jquery");
let Plugin = require("../base");
let annotate = require("../shared/annotate")("labels");
let audit = require("../shared/audit");
let InfoPanel = require("../shared/info-panel");

require("./style.less");

const HIGHLIGHT_CLASS = "tota11y-label-highlight";
const RULE_NAME = "controlsWithoutLabel";

class LabelsPlugin extends Plugin {
    getTitle() {
        return "Labels";
    }

    getDescription() {
        return "Identifies inputs with missing labels";
    }

    run() {
        this.panel = new InfoPanel(this.getTitle());
        let result = audit("controlsWithoutLabel");

        if (result.result === "FAIL") {
            result.elements.forEach((element) => {
                let $el = $(element);

                annotate.highlight($el).addClass(HIGHLIGHT_CLASS);
                this.panel.addError(
                    "Input is missing a label",
                    "Wrap this in a label tag",
                    $el);
            });
        }

        this.panel.render();
    }

    cleanup() {
        annotate.removeAll();
        this.panel.destroy();
    }
}

module.exports = LabelsPlugin;
