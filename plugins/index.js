/**
 * An index of plugins.
 *
 * Exposes an array of plugin instances.
 */

let AltTextPlugin = require("./alt-text");
let ContrastPlugin = require("./contrast");
let HeadingsPlugin = require("./headings");
let LabelsPlugin = require("./labels");
let LandmarksPlugin = require("./landmarks");
let LinkTextPlugin = require("./link-text");
let UnsemanticButtonsPlugin = require("./unsemantic-buttons");

module.exports = [
    new LabelsPlugin(),
    new ContrastPlugin(),
    new LinkTextPlugin(),
    new HeadingsPlugin(),
    new UnsemanticButtonsPlugin(),
    new AltTextPlugin(),
    new LandmarksPlugin(),
];
