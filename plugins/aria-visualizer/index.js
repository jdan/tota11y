/**
 * Allows users to see what screen readers would see.
 */

let Plugin = require("../base");

// this will let us get a shorter info panel that just
// lets the user know we are tracking their focus
const PANEL_OPTIONS = {
  statusPanelView: true,
  disableAnnotation: true,
};

require("./style.less");

class AriaVisualizer extends Plugin {
    constructor(...args) {
      const options = Object.assign({}, args, { panel: PANEL_OPTIONS });

      super(options);
    }

    getTitle() {
        return "aria-* Visualizer";
    }

    getDescription() {
        return "See the effects of your aria-* attributes";
    }

    run() {
        // pop up our info panel to let the user know what we're doing
        this.summary("Visualizing aria-*");
        this.panel.render();

        [...document.querySelectorAll("[aria-hidden=\"true\"]:not(.tota11y)")].forEach((element) => {
          if (!element.closest(".tota11y")) {
            element.classList.add("tota11y-aria-hidden-visualized");
          }
        });
    }

    cleanup() {
        [...document.querySelectorAll(".tota11y-aria-hidden-visualized")].forEach((element) => {
          element.classList.remove("tota11y-aria-hidden-visualized");
        });
    }
}

module.exports = AriaVisualizer;
