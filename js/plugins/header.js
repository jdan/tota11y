/**
 * A plugin to identify (and validate) header tags.
 */

var $ = require("jquery");
var Plugin = require("./plugin-base");
var headerInfoTemplate = require("../../templates/header-plugin.handlebars");

require("../../less/tag.less");
require("../../less/header-plugin.less");

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

    hierarchy($headers) {
        var root = { level: 0, children: [] };
        var prevLevel = 0;

        // TODO: rename subtree?
        var add = (level, text, children, parentLevel) => {
            var last = children.length && children[children.length-1];

            if (!children.length || level <= last.level) {
                var errorData;

                // Check for violations
                if (parentLevel === 0 && level !== 1) {
                    // First header should be an h1
                    errorData = "Your first header should be an <h1>";
                } else if (level === 1 && children.length) {
                    // There should only be one h1
                    errorData = "You should not use more than one <h1>";
                } else if (level - parentLevel > 1) {
                    // Should only go up by one
                    errorData = "You should not have any gaps in your " +
                                "header numbering";
                }

                var $info = $("<span>")
                    .addClass("header-level")
                    .attr("data-error", errorData)
                    .text(level);

                var content = $("<div>")
                    .append($info)
                    .append($("<span>").addClass("header-text").text(text))
                    .html();

                children.push({
                    level: level,
                    children: [],
                    content: content
                });
            } else {
                add(level, text, last.children, last.level);
            }
        };

        $headers.each(function() {
            var $this = $(this);
            var level = +$(this).prop("tagName").slice(1);

            add(level, $(this).text(), root.children, 0);
        });

        var treeToHtml = (tree) => {
            if (tree.level === 0) {
                return $("<div>")
                    .append(tree.children.map(treeToHtml));
            } else {
                return $("<ul>")
                    .append($("<li>").html(tree.content))
                    .append(tree.children.map(treeToHtml));
            }
        };

        // Now convert `tree` to HTML
        return headerInfoTemplate({
            hierarchy: treeToHtml(root).html()
        });
    }

    /**
     * Tags headers
     *
     * Returns HTML mapping out the header hierarchy.
     */
    run() {
        var _tag = this.tag;
        var $headers = $("h1, h2, h3, h4, h5, h6");

        $headers.each(function() {
            _tag($(this));
        });

        return this.hierarchy($headers);
    }

    cleanup() {
        $(".tota11y-tag").remove();
    }
}

module.exports = Header;
