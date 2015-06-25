/**
 * A utility that allows us to mock the DOM and run plugins exactly as they
 * are written.
 *
 * This utility also changes the behavior of "require", allowing us to stub
 * out annotations, less/handlebars modules, and even replace requests for
 * jQuery with our own copy.
 *
 * Importantly, we expose a function that accepts an HTML string and a
 * callback, which will be sent a modified jQuery instance. We can run tests
 * from inside of this callback.
 */

let fs = require("fs");
let jsdom = require("jsdom");
let m = require("module");
let annotateStub = require("./annotate-stub");

let jquerySrc = fs.readFileSync(
    "./node_modules/jquery/dist/jquery.min.js", "utf-8");
let jqueryExtSrc = fs.readFileSync("./test/jquery-extensions.js", "utf-8");

// Store a reference to the original module loader so we can still use it
const originalLoader = m._load;

module.exports = function(html, callback) {
    // Create a jsDom environment from the given HTML and initialize some
    // JavaScript on the page.
    jsdom.env({
        html: html,
        src: [jquerySrc, jqueryExtSrc],
        done: function(errors, window) {
            let $ = window.jQuery;

            // Overwrite the default module loader.
            //
            // Here we intercept `require()` calls to stub out the annotations
            // module, as well as provide our own copy of jQuery.
            m._load = function(request, parent, isMain) {
                if (/annotate$/.test(request)) {
                    return annotateStub;
                } else if (request === "jquery") {
                    return $;
                } else if (!/(\.less|\.handlebars)$/.test(request)) {
                    return originalLoader(request, parent, isMain);
                }
            };

            // Invoke the callback with our copy of jQuery, then close the
            // window once it's done.
            //
            // This assumes our callback is synchronous, but in the future
            // we may need to pass a callback of our own to close the window
            // when appropriate.
            callback($);
            window.close();
        }
    });
};
