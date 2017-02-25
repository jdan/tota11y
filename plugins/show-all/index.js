
let AltTextPlugin = require("../alt-text");
let ContrastPlugin = require("../contrast");
let HeadingsPlugin = require("../headings");
let LabelsPlugin = require("../labels");
let LandmarksPlugin = require("../landmarks");
let LinkTextPlugin = require("../link-text");


let $ = require("jquery");
let Plugin = require("../base");

let annotateAltText = require("../shared/annotate")("alt-text");
let annotateLinkText = require("../shared/annotate")("link-text");
let annotateContrast = require("../shared/annotate")("contrast");
let annotateHeadings = require("../shared/annotate")("headings");
let annotateLabels = require("../shared/annotate")("labels");
let annotateLandmarks = require("../shared/annotate")("landmarks");

let audit = require("../shared/audit");

class ShowAllPlugin extends Plugin {
    getTitle() {
        return "Show all";
    }

    getDescription() {
        return "Activate all options at once.";
    }

    reportError(el) { }

    run() {
        $('html').addClass('show-all');

        new HeadingsPlugin().run();
        new ContrastPlugin().run();
        new LinkTextPlugin().run();
        new LabelsPlugin().run();
        new AltTextPlugin().run();
        new LandmarksPlugin().run();
    }

    cleanup() {
        $('html').removeClass('show-all');

        annotateAltText.removeAll();
        annotateContrast.removeAll();
        annotateHeadings.removeAll();
        annotateLabels.removeAll();
        annotateLandmarks.removeAll();
        annotateLinkText.removeAll();
    }
}

module.exports = ShowAllPlugin;
