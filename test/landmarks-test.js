/**
 * Tests for LandmarksPlugin
 */

let assert = require("assert");
let mockDom = require("./mock-dom");

describe("Landmarks plugin", function() {
    let plugin = null;

    before(function(done) {
        mockDom.createDom(function() {
            let LandmarksPlugin = require("../plugins/landmarks");
            plugin = new LandmarksPlugin();

            done();
        });
    });

    it("should label tags with a role", function() {
        document.body.innerHTML = `
            <div id="main-div" role="main">
                Hello, world!
            </div>
        `;

        plugin.run();

        assert($("#main-div").hasLabel());
        assert($("#main-div").labelText() === "main");
    });

    it("should not label tags without a role", function() {
        document.body.innerHTML = `
            <div id="main-div">
                Hello, world!
            </div>
        `;

        plugin.run();

        assert(!$("#main-div").hasLabel());
    });
});
