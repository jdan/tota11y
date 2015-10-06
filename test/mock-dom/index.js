/**
 * A utility that allows us to mock the DOM and run plugins exactly as they
 * are written.
 *
 * This module changes the behavior of "require," allowing us to stub out
 * imports of jQuery and the annotations module.
 *
 * Additionally, the module exposes a number of variables from the jsdom
 * instance to the global namespace. Allowing us to code as if we're in
 * a browser environment (i.e. using "document") while skipping the webpack
 * bundling step.
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
            // Expose some fields from `window` onto the global namespace
            //
            // TODO: Currently we add fields here as we need them, but this
            // may prove tricky to maintain.
            global.document = window.document;
            global.$ = window.jQuery;
            global.axs = window.axs;
            global.Node = window.Node;

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

            callback();
        }
    });
};
