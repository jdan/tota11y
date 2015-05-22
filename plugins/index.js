/**
 * An index of plugins.
 *
 * Exposes an array of plugin instances.
 */

var AltTextPlugin = require("./alt-text");
var HeadingsPlugin = require("./headings");
var LabelsPlugin = require("./labels");
var LandmarksPlugin = require("./landmarks");

module.exports = [
    new HeadingsPlugin(),
    new AltTextPlugin(),
    new LabelsPlugin(),
    new LandmarksPlugin(),
];
