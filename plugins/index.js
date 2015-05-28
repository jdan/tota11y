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

module.exports = [
    new HeadingsPlugin(),
    new ContrastPlugin(),
    new AltTextPlugin(),
    new LabelsPlugin(),
    new LandmarksPlugin(),
];
