/**
 * An index of plugins.
 *
 * Exposes an array of plugin instances.
 */

let AltTextPlugin = require("./alt-text");
let ContrastPlugin = require("./contrast");
let FocusStylesPlugin = require("./focus-styles");
let HeadingsPlugin = require("./headings");
let LabelsPlugin = require("./labels");
let LandmarksPlugin = require("./landmarks");
let LinkTextPlugin = require("./link-text");

module.exports = [
    new LabelsPlugin(),
    new ContrastPlugin(),
    new LinkTextPlugin(),
    new HeadingsPlugin(),
    new FocusStylesPlugin(),
    new AltTextPlugin(),
    new LandmarksPlugin(),
];
