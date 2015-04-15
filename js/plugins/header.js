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
        var add = (level, text, children) => {
            var last = children.length && children[children.length-1];

            if (!children.length || level <= last.level) {
                children.push({
                    level: level,
                    children: [],
                    text: text
                });
            } else {
                add(level, text, last.children);
            }
        };

        $headers.each(function() {
            var $this = $(this);
            var level = +$this.prop("tagName").slice(1);

            add(level, $this.text(), root.children);
        });

        var treeToHtml = (tree) => {
            if (tree.level === 0) {
                return $("<div>")
                    .append(tree.children.map(treeToHtml));
            } else {
                return $("<ul>")
                    .append($("<li>").text(tree.level + ' - ' + tree.text))
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
