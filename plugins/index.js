/**
 * An index of plugins.
 *
 * Exposes an array of plugins
 */

let HeadingsPlugin = require("./headings");
let TitlePlugin = require("./title");

module.exports = {
    default: [
	      HeadingsPlugin,
	      TitlePlugin,
    ]
};
