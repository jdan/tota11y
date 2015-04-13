var Plugin = require("./plugin-base");
var $ = require("jquery");

class Header extends Plugin {
    getTitle() {
        return "Headers";
    }

    getDescription() {
        return "Highlights headers (<h1>, <h2>, etc) and order violations";
    }

    execute() {
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