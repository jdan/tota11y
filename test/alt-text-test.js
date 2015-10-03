/**
 * Tests for AltTextPlugin
 */

let assert = require("assert");
let mockDom = require("./mock-dom");

describe("Alt text plugin", function() {
    let plugin = null;

    before(function(done) {
        mockDom.createDom(function() {
            let LinkTextPlugin = require("../plugins/alt-text");
            plugin = new LinkTextPlugin();

            done();
        });
    });

    it("should label images without alt text", function() {
        document.body.innerHTML = `
            <img id="bad-img" src="test.jpg" />
        `;

        plugin.run();

        assert($("#bad-img").hasErrorLabel());
    });

    it("should not label images with alt text", function() {
        document.body.innerHTML = `
            <img id="good-img" src="test.jpg" alt="This is a description" />
        `;

        plugin.run();

        assert(!$("#good-img").hasLabel());
    });

    it("should not label images with aria-labels", function() {
        document.body.innerHTML = `
            <div id="label">Hello</div>
            <img id="img-with-aria-labelledby"
                 aria-labelledby="label"
                 src="test.jpg" />

            <img id="img-with-aria-label"
                 aria-label="This is a label"
                 src="test2.jpg" />
        `;

        assert(!$("img-with-aria-labelledby").hasLabel());
        assert(!$("img-with-aria-label").hasLabel());
    });

    it("should not label hidden images without alt text", function() {
        document.body.innerHTML = `
            <div style="display:none">
                <img id="hidden-bad-img" src="test.jpg" />
            </div>
            <img aria-hidden="true" id="aria-hidden-bad-img" />
        `;

        plugin.run();

        assert(!$("#hidden-bad-img").hasLabel());
        assert(!$("#aria-hidden-bad-img").hasLabel());
    });

    it("should label presentational images with warnings", function() {
        document.body.innerHTML = `
            <img id="empty-alt" src="test.jpg" alt="" />
            <img id="presentational" role="presentation" src="test2.jpg" />
        `;

        plugin.run();

        assert($("#empty-alt").hasErrorLabel());
        assert($("#empty-alt").hasClass("tota11y-label-warning"));
        assert(/decorative/.test($("#empty-alt").expandedText()));

        assert($("#presentational").hasErrorLabel());
        assert($("#presentational").hasClass("tota11y-label-warning"));
        assert(/decorative/.test($("#presentational").expandedText()));
    });
});
