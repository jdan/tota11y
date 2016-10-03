/**
 * Tests for LinkTextPlugin
 */

let assert = require("assert");
let mockDom = require("./mock-dom");

describe("Link text plugin", function() {
    let plugin = null;

    before(function(done) {
        mockDom.createDom(function() {
            let LinkTextPlugin = require("../plugins/link-text");
            plugin = new LinkTextPlugin();

            done();
        });
    });

    it("should not label descriptive links", function() {
        document.body.innerHTML = `
            <a href="#" id="good-link">
                This is a descriptive link
            </a>
        `;

        plugin.run();

        assert(!$("#good-link").hasLabel());
    });

    it("should label unclear links", function() {
        document.body.innerHTML = `
            <a href="#" id="bad-link">Click here</a> to learn more about
            dinosaurs. You can also <a id="better-link" href="#">
            check out my blog</a>.
        `;

        plugin.run();

        assert($("#bad-link").hasLabel());
        assert(!$("#better-link").hasLabel());
    });

    it("should consider alt text as link text", function() {
        document.body.innerHTML = `
            <a href="#" id="logo-link">
                <img src="/images/logo.png" alt="Our logo" />
            </a>
        `;

        plugin.run();

        // TODO: Test the extended error messages for the presence of "alt"
        assert(!$("#logo-link").hasLabel());
    });

    it("should fail on image links with unclear alt text", function() {
        document.body.innerHTML = `
            <a href="#" id="bad-image-link">
                <img src="/images/banner.png" alt="Click here" />
            </a>
        `;

        plugin.run();

        assert($("#bad-image-link").hasLabel());
    });

    it("should fail on empty links", function() {
        document.body.innerHTML = `
            <a href="#" id="empty-link"></a>
        `;

        plugin.run();

        assert($("#empty-link").hasLabel());
    });

    it("should pass on empty links with aria-labels", function() {
        document.body.innerHTML = `
            <a href="#"
               aria-label="this is a detailed description"
               id="empty-link-with-label">
            </a>

            <a href="#"
               aria-labelledby="link-description"
               id="empty-link-with-labelledby">
            </a>
            <span id="link-description">This is a detailed description</span>
        `;

        plugin.run();

        assert(!$("#empty-link-with-label").hasLabel());
        assert(!$("#empty-link-with-labelledby").hasLabel());
    });

    it("should fail on links with unclear aria-labels", function() {
        document.body.innerHTML = `
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
        `;

        plugin.run();

        assert($("#empty-link-with-unclear-label").hasLabel());
        assert($("#empty-link-with-unclear-labelledby").hasLabel());
    });

    it("should not fail on hidden links", function() {
        document.body.innerHTML = `
            <ul style="display:none;">
                <li>
                    <a id="hidden-link" href="#">About</a>
                </li>
            </ul>
        `;

        plugin.run();
        assert(!$("#hidden-link").hasLabel());
    });
});
