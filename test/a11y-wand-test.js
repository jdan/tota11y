/**
 * Tests for a11yTextWand
 */

let assert = require("assert");
let mockDom = require("./mock-dom");

describe("Screen Reader Wand", function() {
    let plugin = null;

    before(function(done) {
        mockDom.createDom(function() {
            let ScreenReaderWand = require("../plugins/a11y-text-wand");

            plugin = new ScreenReaderWand();

            document.body.innerHTML = `
                <article id="article">
                    <p>This paragraph is visible.</p>
                    <p id="p-with-hidden">This paragraph has a <span id="span" aria-hidden="true">hidden</span> span.</p>
                    <p id="hidden-p" aria-hidden="true">This paragraph is hidden.</p>
                </article>
            `;

            done();
        });
    });

    it("should ignore element with aria-hidden", function() {
        // Arrange
        plugin.run();

        // Act
        $(document).trigger("mousemove.wand", $("#hidden-p"));

        // Assert
        assert($(".tota11y-info-section").text() === "No text visible to a screen reader");
    });

    it("should ignore child elmement with aria-hidden", function() {
        // Arrange
        plugin.run();

        // Act
        $(document).trigger("mousemove.wand", $("#p-with-hidden"));

        // Assert
        assert($(".tota11y-info-section").text() === "This paragraph has a span.");
    });

    it("should ignore multiple child elements with aria-hidden", function() {
        // Arrange
        plugin.run();

        // Act
        $(document).trigger("mousemove.wand", $("#article"));

        // Assert
        assert($(".tota11y-info-section").text() === "This paragraph is visible. This paragraph has a span.");
    });
});
