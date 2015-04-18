/**
 * An index of plugins.
 *
 * Exposes an array of plugin instances.
 */

var AltTextPlugin = require("./alt-text");
var HeaderPlugin = require("./header");

module.exports = [
    new HeaderPlugin(),
    new AltTextPlugin(),
];
