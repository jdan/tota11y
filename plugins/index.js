/**
 * An index of plugins.
 *
 * Exposes an array of plugin instances.
 */

var AltTextPlugin = require("./alt-text");
var HeadersPlugin = require("./headers");

module.exports = [
    new HeadersPlugin(),
    new AltTextPlugin(),
];
