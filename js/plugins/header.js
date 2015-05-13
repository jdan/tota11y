/**
 * A plugin to identify (and validate) header tags.
 */

var $ = require("jquery");
var Plugin = require("./plugin-base");

class Header extends Plugin {
    getTitle() {
        return "Headers";
    }

    getDescription() {
        return "Highlights headers (<h1>, <h2>, etc) and order violations";
    }

    run() {
        $("h1, h2, h3, h4, h5, h6").css({
            "border": "1px solid #000"
        });
    }

    cleanup() {
        $("h1, h2, h3, h4, h5, h6").css({
            "border": "none"
        });
    }
}

module.exports = Header;
