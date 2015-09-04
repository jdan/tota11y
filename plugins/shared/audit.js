/**
 * Abstractions for how we use Accessibility Developer Tools
 */

let $ = require("jquery");

function allRuleNames() {
    return $.axs.AuditRules.getRules().map(rule => rule.name);
}

// Creates an audit configuration that whitelists a single rule and limits the
// amount of tests to run
function createWhitelist(ruleName) {
    var config = new $.axs.AuditConfiguration();
    config.showUnsupportedRulesWarning = false;

    // Ignore elements that are part of the toolbar
    config.ignoreSelectors(ruleName, ".tota11y *");

    allRuleNames().forEach((name) => {
        if (name !== ruleName) {
            config.ignoreSelectors(name, "*");
        }
    });

    return config;
}

// Audits for a single rule (by name) and returns the results for only that
// rule
function audit(ruleName) {
    let whitelist = createWhitelist(ruleName);

    return $.axs.Audit.run(whitelist)
        .filter(result => result.rule.name === ruleName)[0];
}

module.exports = audit;
