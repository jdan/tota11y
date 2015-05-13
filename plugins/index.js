/**
 * An index of plugins.
 *
 * Exposes an array of plugin instances.
 */

var AltTextPlugin = require("./alt-text");
var HeadersPlugin = require("./headers");
var LabelsPlugin = require("./labels");
var LandmarksPlugin = require("./landmarks");

module.exports = [
    new HeadersPlugin(),
    new AltTextPlugin(),
    new LabelsPlugin(),
    new LandmarksPlugin(),
];
