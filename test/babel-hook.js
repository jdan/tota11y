/**
 * A mocha hook that will run before each test.
 *
 * This sets up babel with options, and stores our JSX transpile target.
 */

var options = require("../utils/options");

// Register all future "require"s with babel
require("babel-core/register")({
    presets: ["env", "react"],
    plugins: [
        ["transform-react-jsx", {
            "pragma": options.jsxPragma, // default pragma is React.createElement
        }]
    ],
});

// Store our custom JSX transpile target as a global
global[options.jsxPragma] = require("../utils/element.js");
