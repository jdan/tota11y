/**
 * Tests for LinkTextPlugin
 */

let assert = require("assert");
let mockDom = require("./mock-dom");

describe("Link text plugin", function() {
    let dom = null;
    let plugin = null;

    before(function(done) {
        mockDom.createDom(function(domObj) {
            // Assign `dom` to the object returned by createDom, which allows
            // us to set the HTML of the virtual environment, query it, and
            // close the window.
            dom = domObj;

            let LinkTextPlugin = require("../plugins/link-text");
            plugin = new LinkTextPlugin();

            done();
        });
    });

    it("should not label descriptive links", function() {
        dom.setHTML(`
            <a href="#" id="good-link">
                This is a descriptive link
            </a>
        `);

        plugin.run();

        assert(!dom.$("#good-link").hasLabel());
    });

    it("should label unclear links", function() {
        dom.setHTML(`
            <a href="#" id="bad-link">Click here</a> to learn more about
            dinosaurs. You can also <a id="better-link" href="#">
            check out my blog</a>.
        `);

        plugin.run();

        assert(dom.$("#bad-link").hasLabel());
        assert(!dom.$("#better-link").hasLabel());
    });

    it("should consider alt text as link text", function() {
        dom.setHTML(`
            <a href="#" id="logo-link">
                <img src="/images/logo.png" alt="Our logo" />
            </a>
        `);

        plugin.run();

        // TODO: Test the extended error messages for the presence of "alt"
        assert(!dom.$("#logo-link").hasLabel());
    });

    it("should fail on image links with unclear alt text", function() {
        dom.setHTML(`
            <a href="#" id="bad-image-link">
                <img src="/images/banner.png" alt="Click here" />
            </a>
        `);

        plugin.run();

        assert(dom.$("#bad-image-link").hasLabel());
    });

    it("should fail on empty links", function() {
        dom.setHTML(`
            <a href="#" id="empty-link"></a>
        `);

        plugin.run();

        assert(dom.$("#empty-link").hasLabel());
    });

    it("should pass on empty links with aria-labels", function() {
        dom.setHTML(`
            <a href="#"
               aria-label="this is a detailed description"
               id="empty-link-with-label">
            </a>

            <a href="#"
               aria-labelledby="link-description"
               id="empty-link-with-labelledby">
            </a>
            <span id="link-description">This is a detailed description</span>
        `);

        plugin.run();

        assert(!dom.$("#empty-link-with-label").hasLabel());
        assert(!dom.$("#empty-link-with-labelledby").hasLabel());
    });

    it("should fail on links with unclear aria-labels", function() {
        dom.setHTML(`
            <a href="#"
               aria-label="click here"
               id="empty-link-with-unclear-label">
                This is a longer description that will not be picked up
            </a>

            <a href="#"
               aria-labelledby="link-description"
               id="empty-link-with-unclear-labelledby">
                This is a longer description that will not be picked up
            </a>
            <span id="link-description">Click here</span>
        `);

        plugin.run();

        assert(dom.$("#empty-link-with-unclear-label").hasLabel());
        assert(dom.$("#empty-link-with-unclear-labelledby").hasLabel());
    });

    after(function() {
        dom.destroy();
    });
});
