/**
 * A plugin to identify empty elements, esp those to fake styling
 *  <p>, <h1..6>, <li>, <ol>, <ul> and <br><br>
 * do we need to strip out &nbsp too? TODO
 * 
 * TODO: add tests on dummy index page for these
 */


let $ = require("jquery");
let Plugin = require("../base");
let annotate = require("../shared/annotate")("landmarks");


let outlineItemTemplate = require("./index.js");
require("./index.js");


class EmptyElementsPlugin extends Plugin {
    getTitle() {
        return "Empty elements";
    }

    getDescription() {
        return `
            Highlights empty elements that should be removed
        `;
    }
	run() {
		  $("p:empty, h1:empty, h2:empty, h3:empty, h4:empty, h5:empty, h6:empty, li:empty, ol:empty, ul:empty, br+br").each(function () {
			annotate.label($(this), $(this).prop("tagName"));
		});

	  }

	  cleanup() {
		annotate.removeAll();
	
	  }
	}


module.exports = EmptyElementsPlugin;
