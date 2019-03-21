/**
 * Allows users to see what screen readers would see.
 */

let Plugin = require("../base");

let annotate = require("../shared/annotate")("roles");

// this will let us get a shorter info panel that just
// lets the user know we are tracking their focus
const PANEL_OPTIONS = {
  statusPanelView: true
};

const ATTRIBUTES = [
    "role",
    "aria-hidden"
];

require("./style.less");

const formatAttributeForMethodName = (attribute) => {
    return attribute.split("-").map(part => `${part[0].toUpperCase()}${part.substr(1)}`).join("");
}

class AriaVisualizer extends Plugin {
    constructor(...args) {
        const options = Object.assign({}, args, { panel: PANEL_OPTIONS });

        super(options);

        this.ariaAttributes = ATTRIBUTES.reduce((functionMap, attribute) => {
            const methodSuffix = formatAttributeForMethodName(attribute);

            functionMap[attribute] = {
                enable: this[`start${methodSuffix}`],
                disable: this[`stop${methodSuffix}`]
            };

            return functionMap;
        }, {});
    }

    getTitle() {
        return "aria-* Visualizer";
    }

    getDescription() {
        return "See the effects of your aria-* and other a11y attributes";
    }

    startAriaHidden(attribute) {
        const ariaName = `aria-${attribute}`;

        [...document.querySelectorAll(`[${ariaName}="true"]:not(.tota11y)`)].forEach((element) => {
            if (!element.closest(".tota11y")) {
                element.classList.add(`tota11y-${ariaName}-visualized`);
            }
        });
    }

    stopAriaHidden(attribute) {
        const ariaName = `aria-${attribute}`;

        const className = `tota11y-${ariaName}-visualized`;

        [...document.querySelectorAll(`.${className}`)].forEach((element) => {
            element.classList.remove(className);
        });
    }

    startRole(attribute) {
        [...document.querySelectorAll(`[${attribute}]:not(.tota11y)`)].forEach((element) => {
            if (!element.closest(".tota11y")) {
                annotate.label(
                    element,
                    `role: ${element.getAttribute("role")}`
                );
            }
        });
    }

    stopRole() {
        annotate.removeAll();
    }

    run() {
        // pop up our info panel to let the user know what we're doing
        this.summary("Visualizing a11y attributes");
        this.panel.render();

        Object.keys(this.ariaAttributes).forEach((property) => {
            this.ariaAttributes[property].enable(property);
        });
    }

    cleanup() {
        Object.keys(this.ariaAttributes).forEach((property) => {
            this.ariaAttributes[property].disable(property);
        });
    }
}

module.exports = AriaVisualizer;
