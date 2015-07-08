/**
 * Some jQuery extensions that correspond with how the annotations stub
 * mark elements.
 *
 * This file will be loaded into test documents by the mock-dom utility.
 */

var $ = window.jQuery;

$.fn.hasLabel = function() {
    return !!$(this).data("has-label");
};

$.fn.hasErrorLabel = function() {
    return !!$(this).data("has-error-label");
};

$.fn.labelText = function() {
    return $(this).data("label-text");
};

$.fn.expandedText = function() {
    return $(this).data("expanded-text");
};

// Bind the global `axs` object from Accessibility Developer Tools to jQuery
$.axs = window.axs;
