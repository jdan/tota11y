/**
 * A utility that allows us to mock the DOM and run plugins exactly as they
 * are written.
 *
 * This utility also universally changes the behavior of "require", allowing
 * us to stub out annotations, less/handlebars modules, and even replace
 * requests for jQuery with our own copy.
 *
 * Exported is a `createDom` function, which sets up a jsdom environment and
 * sends to the callback an object containing the following:
 *
 *   - setHTML: which allows tests to change the HTML content of the page
 *   - $: which allows tests to access the jQuery instance running on the page
 *   - destroy: which allows tests to destroy the page. This is typically run
 *              in the magic `after` function of a mocha test group.
 */

let fs = require("fs");
let jsdom = require("jsdom");
let m = require("module");
let annotateStub = require("./annotate-stub");

let axsSrc = fs.readFileSync(
    "./node_modules/accessibility-developer-tools/dist/js/axs_testing.js",
    "utf-8");
let jquerySrc = fs.readFileSync(
    "./node_modules/jquery/dist/jquery.min.js", "utf-8");
let jqueryExtSrc = fs.readFileSync(
    "./test/mock-dom/jquery-extensions.js", "utf-8");

exports.createDom = function(callback) {
    // Create a jsDom environment from the given HTML and initialize some
    // JavaScript on the page.
    jsdom.env({
        html: "",
        src: [axsSrc, jquerySrc, jqueryExtSrc],
        done: function(errors, window) {
            // Overwrite the default module loader.
            //
            // Here we intercept `require()` calls to stub out the annotations
            // module, as well as provide our own copy of jQuery.
            //
            // First, store a reference to the original module loader so we
            // can still use it.
            const originalLoader = m._load;

            m._load = function(request, parent, isMain) {
                if (/annotate$/.test(request)) {
                    // Return a stub of the annotations module to plugins that
                    // `require` it
                    return annotateStub;
                } else if (request === "jquery") {
                    // Return this window's jQuery instance to plugins that
                    // require "jquery"
                    return window.jQuery;
                } else if (!/(\.less|\.handlebars)$/.test(request)) {
                    // Defer to the original loader for everything else, with
                    // the exception that we'll ignore webpack's less and
                    // handlebars loaders
                    return originalLoader(request, parent, isMain);
                }
            };

            callback({
                setHTML(html) {
                    window.document.body.innerHTML = html;
                },

                destroy() {
                    window.close();
                },

                $: window.jQuery,
            });
        }
    });
};
