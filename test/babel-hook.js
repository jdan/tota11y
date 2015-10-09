/**
 * A mocha hook that will run before each test.
 *
 * This sets up babel with options, and stores our JSX transpile target.
 */

var options = require("../utils/options");

// Register all future "require"s with babel
require("babel/register")({
    jsxPragma: options.jsxPragma,
});

// Store our custom JSX transpile target as a global
global[options.jsxPragma] = require("../utils/element.js");
