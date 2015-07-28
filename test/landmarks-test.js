/**
 * Tests for LandmarksPlugin
 */

let assert = require("assert");
let mockDom = require("./mock-dom");

describe("Landmarks plugin", function() {
    let dom = null;
    let plugin = null;

    before(function(done) {
        mockDom.createDom(function(domObj) {
            // Assign `dom` to the object returned by createDom, which allows
            // us to set the HTML of the virtual environment, query it, and
            // close the window.
            dom = domObj;

            let LandmarksPlugin = require("../plugins/landmarks");
            plugin = new LandmarksPlugin();

            done();
        });
    });

    it("should label tags with a role", function() {
        dom.setHTML(`
            <div id="main-div" role="main">
                Hello, world!
            </div>
        `);

        plugin.run();

        assert(dom.$("#main-div").hasLabel());
        assert(dom.$("#main-div").labelText() === "main");
    });

    it("should not label tags without a role", function() {
        dom.setHTML(`
            <div id="main-div">
                Hello, world!
            </div>
        `);

        plugin.run();

        assert(!dom.$("#main-div").hasLabel());
    });

    after(function() {
        dom.destroy();
    });
});
