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

        return $tag;
    }

    // Very similar to tag...
    highlight($el) {
        var $offsetParent = $el.offsetParent();
        var { top, bottom, left, right } = $el[0].getBoundingClientRect();

        var $highlight = $("<div>")
            .addClass("tota11y-highlight")
            .css({
                top: top,
                left: left,
                width: right - left,
                height: bottom - top,
            });

        $offsetParent.append($highlight);

        return $highlight;
    }

    hierarchy($headers) {
        // `root` is a pseudotree that we will eventually use to construct the
        // info panel
        var root = { level: 0, children: [] };
        var prevLevel = 0;

        // Function to add an item to the `root` tree.
        // This checks the item for any header violations, and builds an
        // element that we can eventually place in the info panel.
        var add = ($el, children, parentLevel) => {
            var last = children.length && children[children.length-1];
            var level = +$el.prop("tagName").slice(1);
            var text = $el.text();

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

                // Create a new node
                children.push({
                    level: level,
                    children: [],
                    content: content,
                    $el: $el
                });
            } else {
                add($el, last.children, last.level);
            }
        };

        $headers.each(function() {
            add($(this), root.children, 0);
        });

        // This builds the info box and attaches some event listeners to its
        // items
        var $highlight;
        var treeToHtml = (tree) => {
            var $root = (tree.level === 0) ?
                $("<div>") :
                $("<ul>").append($("<li>").html(tree.content));

            $root.append(tree.children.map(treeToHtml));

            // Tag the parent element and set events
            if (tree.$el) {
                this.tag(tree.$el);

                $root.find("> li").on("mouseenter", (e) => {
                    e.stopPropagation();
                    $highlight && $highlight.remove();
                    $highlight = this.highlight(tree.$el);
                }).on("mouseleave", (e) => {
                    e.stopPropagation();
                    $highlight.remove();
                });
            }

            return $root;
        };

        // Finally, convert `tree` to HTML
        return treeToHtml(root);
    }

    /**
     * Tags headers
     *
     * Returns HTML mapping out the header hierarchy.
     */
    run() {
        var _tag = this.tag;
        var $headers = $("h1, h2, h3, h4, h5, h6");

        var $template = $(headerInfoTemplate());
        var $hierarchy = this.hierarchy($headers);

        $template.find(".hierarchy").append($hierarchy);

        return $template;
    }

    cleanup() {
        $(".tota11y-tag").remove();
    }
}

module.exports = Header;
