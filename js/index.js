var plugins = require("./plugins");
var Header = require("./plugins/header");
var $ = require("jquery");

$(function() {
    var h = new Header();
    h.execute();
})