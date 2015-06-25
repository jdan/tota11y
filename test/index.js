let assert = require("assert");
let mockDom = require("./mock-dom");

describe("Landmarks plugin", function() {
    it("should label tags with a role", function(done) {
        mockDom(`
            <div role="main" id="main-div">
                Hello, world!
            </div>
        `, function($) {
            let LandmarksPlugin = require("../plugins/landmarks");
            let plugin = new LandmarksPlugin();

            plugin.run();

            assert($("#main-div").hasLabel());
            assert($("#main-div").labelText() === "main");

            done();
        });
    });
});
