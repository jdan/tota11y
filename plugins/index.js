/**
 * An index of plugins.
 *
 * Exposes an array of plugin instances.
 */

var AltTextPlugin = require("./alt-text");
var HeadersPlugin = require("./headers");
var LabelsPlugin = require("./labels");

module.exports = [
    new HeadersPlugin(),
    new AltTextPlugin(),
    new LabelsPlugin(),
];
