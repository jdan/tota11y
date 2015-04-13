/**
 * An index of plugins.
 *
 * Exposes an array of plugin instances.
 */

var HeaderPlugin = require("./header");

module.exports = [
    new HeaderPlugin()
];
