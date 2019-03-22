/**
 * Allows users to see what screen readers would see.
 */

let Plugin = require("../base");

let annotate = require("../shared/annotate")("tabIndex");

const FOCUS_EVENT = "focusin";
const BLUR_EVENT = "focusout";

// this will let us get a shorter info panel that just
// lets the user know we are tracking their focus
const PANEL_OPTIONS = {
  statusPanelView: true
};

// we're going to use focusin and focusout because they bubble
const FOCUS_STATES = {
  [FOCUS_EVENT]: "tota11y-outlined",
  [BLUR_EVENT]: "tota11y-was-focused"
};

// we'll use this to make sure we don't apply the was-focused
// indicator to our tota11y panels
const IGNORE = "tota11y"

// we're going to attempt to visualize the tab order of the page
// based on the source order of the tabbable elements
// this Array contains our tabbable element selectors
const TABABLE_ELEMENTS = [
    "a[href]",
    "area[href]",
    "iframe",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "button:not([disabled])",
    "[tabIndex]:not([tabIndex=\"-1\"])",
    "[contenteditable]"
];

// convenient method to quickly remove any classes this
// plugin applied
// it is outside of the class because it doesn't really need
// to access this and it lets us now worry about binding
// our event handlers
const removeFocusClasses = (element) => {
  element.classList.remove(...Object.values(FOCUS_STATES));
};

require("./style.less");

class FocusTracker extends Plugin {
    constructor(...args) {
      const options = Object.assign({}, args, { panel: PANEL_OPTIONS });

      super(options);
    }

    getTitle() {
        return "Focus Tracker";
    }

    getDescription() {
        return "Keep track of what's been focused as you tab through the page";
    }

    applyFocusClass(event) {
      // get the event target and event name
      const { target, type } = event;

      // remove any focused or was-focused indicators on the element
      removeFocusClasses(target);

      // we want to ignore our tota11y toggle and panel because
      // the user probably only cares about focusable elements on
      // their page getting this visual treatment
      if (type === FOCUS_EVENT || !target.closest(`.${IGNORE}`)) {
          // choose the class we want to add to this element
          // based on whether this is the focusin or focusout event
          target.classList.add(FOCUS_STATES[type]);
      }
    }

    // this won't be perfect because you can reorder things visually,
    // but's let's display the tab order based on source order of the page
    annotateSourceTabOrder() {
        const selector = TABABLE_ELEMENTS.join(", ");

        [...document.querySelectorAll(selector)]
            .filter((element) => {
                return !element.closest(`.${IGNORE}`);
            })
            .forEach((element, index) => {
              annotate.label(element, `tabIndex: ${index}`);
            })
        ;
    }

    annotateProgrammaticallyFocusableElements() {
        [...document.querySelectorAll("[tabIndex=\"-1\"]")].forEach((element) => {
            annotate.label(element, "tabIndex: -1");
        });
    }

    addAnnotations() {
      this.annotateSourceTabOrder();
      this.annotateProgrammaticallyFocusableElements();
    }

    run() {
        // pop up our info panel to let the user know what we're doing
        this.summary("Tracking Focus.");
        this.panel.render();

        // dynamically apply our event listeners by looping through
        // our defined focus states and adding an event handler
        Object.keys(FOCUS_STATES).forEach((key) => {
          document.addEventListener(key, this.applyFocusClass);
        });

        this.addAnnotations();
    }

    cleanup() {
        // clear annotations
        annotate.removeAll();

        // dynamically remove our event listeners by looping through
        // our defined focus states and removing the event handler
        Object.keys(FOCUS_STATES).forEach((key) => {
          document.removeEventListener(key, this.applyFocusClass);

          // we'll also want to clean up all of the classes we added
          [...document.querySelectorAll(`.${FOCUS_STATES[key]}`)].forEach((element) => {
            removeFocusClasses(element);
          });
        });
    }
}

module.exports = FocusTracker;
