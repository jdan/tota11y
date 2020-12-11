/**
 * A plugin to label all ARIA landmark roles
 */

let $ = require("jquery");
let Plugin = require("../base");
let annotate = require("../shared/annotate")("Title attributes");
require("./style.less");

class TitlesPlugin extends Plugin {
  getTitle() {
    return "Title attributes";
  }

  getDescription() {
    return "Labels redundant and missing title attributes";
  }

  run() {
    $("[title]").each(function () {
      if ($(this).prop("tagName") !== "IFRAME") {
        annotate
          .label($(this), $(this).attr("title"))
          .addClass("tota11y-label-warning");
      }
    });

    $("iframe").each(function () {
      if (!this.hasAttribute("title")) {
        annotate.errorLabel($(this), "Error", "iframe with no title", "");
      }
    });
  }

	cleanup() {
		annotate.removeAll();
}
}

module.exports = TitlesPlugin;
