
let AltTextPlugin = require("../alt-text");
let ContrastPlugin = require("../contrast");
let HeadingsPlugin = require("../headings");
let LabelsPlugin = require("../labels");
let LandmarksPlugin = require("../landmarks");
let LinkTextPlugin = require("../link-text");


let $ = require("jquery");
let Plugin = require("../base");
let annotate = require("../shared/annotate")("alt-text");
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
        new HeadingsPlugin().run();
        new ContrastPlugin().run();
        new LinkTextPlugin().run();
        new LabelsPlugin().run();
        new AltTextPlugin().run();
        new LandmarksPlugin().run();
    }

    cleanup() {
        annotate.removeAll();
    }
}

module.exports = ShowAllPlugin;
