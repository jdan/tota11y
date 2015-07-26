/**
 * Tests for AltTextPlugin
 */

let assert = require("assert");
let mockDom = require("./mock-dom");

describe("Alt text plugin", function() {
    let dom = null;
    let plugin = null;

    before(function(done) {
        mockDom.createDom(function(domObj) {
            // Assign `dom` to the object returned by createDom, which allows
            // us to set the HTML of the virtual environment, query it, and
            // close the window.
            dom = domObj;

            let LinkTextPlugin = require("../plugins/alt-text");
            plugin = new LinkTextPlugin();

            done();
        });
    });

    it("should label images without alt text", function() {
        dom.setHTML(`
            <img id="bad-img" src="test.jpg" />
        `);

        plugin.run();

        assert(dom.$("#bad-img").hasErrorLabel());
    });

    it("should not label images with alt text", function() {
        dom.setHTML(`
            <img id="good-img" src="test.jpg" alt="This is a description" />
        `);

        plugin.run();

        assert(!dom.$("#good-img").hasLabel());
    });

    it("should not label images with aria-labels", function() {
        dom.setHTML(`
            <div id="label">Hello</div>
            <img id="img-with-aria-labelledby"
                 aria-labelledby="label"
                 src="test.jpg" />

            <img id="img-with-aria-label"
                 aria-label="This is a label"
                 src="test2.jpg" />
        `);

        assert(!dom.$("img-with-aria-labelledby").hasLabel());
        assert(!dom.$("img-with-aria-label").hasLabel());
    });

    it("should not label hidden images without alt text", function() {
        dom.setHTML(`
            <div style="display:none">
                <img id="hidden-bad-img" src="test.jpg" />
            </div>
            <img aria-hidden="true" id="aria-hidden-bad-img" />
        `);

        plugin.run();

        assert(!dom.$("#hidden-bad-img").hasLabel());
        assert(!dom.$("#aria-hidden-bad-img").hasLabel());
    });

    it("should label presentational images with warnings", function() {
        dom.setHTML(`
            <img id="empty-alt" src="test.jpg" alt="" />
            <img id="presentational" role="presentation" src="test2.jpg" />
        `);

        plugin.run();

        assert(dom.$("#empty-alt").hasErrorLabel());
        assert(dom.$("#empty-alt").hasClass("tota11y-label-warning"));
        assert(/decorative/.test(dom.$("#empty-alt").expandedText()));

        assert(dom.$("#presentational").hasErrorLabel());
        assert(dom.$("#presentational").hasClass("tota11y-label-warning"));
        assert(/decorative/.test(dom.$("#presentational").expandedText()));
    });

    after(function() {
        dom.destroy();
    });
});
