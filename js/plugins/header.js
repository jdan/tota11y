/**
 * A plugin to identify (and validate) header tags.
 */

var $ = require("jquery");
var Plugin = require("./plugin-base");

require("../../less/tag.less");

class Header extends Plugin {
    getTitle() {
        return "Headers";
    }

    getDescription() {
        return "Highlights headers (<h1>, <h2>, etc) and order violations";
    }

    /**
     * Tags a particular jQuery element with its tagName
     */
    tag($el) {
        var tagName = $el.prop("tagName").toLowerCase();

        // We'll position the tag absolutely to its nearest positioned
        // ancestor
        var $offsetParent = $el.offsetParent();
        var { top, left } = $el.position();

        var $tag = $("<span>")
            .addClass("tota11y-tag")
            .css({
                top: top + parseFloat($el.css("margin-top")),
                left: left
            })
            .text(tagName);

        $offsetParent.append($tag);
    }

    run() {
        var _tag = this.tag;
        $("h1, h2, h3, h4, h5, h6").each(function() {
            _tag($(this));
        });
    }

    cleanup() {
        $(".tota11y-tag").remove();
    }
}

module.exports = Header;
