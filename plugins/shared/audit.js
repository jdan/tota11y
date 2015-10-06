/**
 * Abstractions for how we use Accessibility Developer Tools
 */

function allRuleNames() {
    return axs.AuditRules.getRules().map(rule => rule.name);
}

// Creates an audit configuration that whitelists a single rule and limits the
// amount of tests to run
function createWhitelist(ruleName) {
    var config = new axs.AuditConfiguration();
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

/*eslint-disable*/
// Patch collectMatchingElements to match
// https://github.com/GoogleChrome/accessibility-developer-tools/blob/0062f77258eb4eb8508dad3c92fd2df63c2381fc/src/js/AuditRule.js
//
// TODO: Remove once https://github.com/GoogleChrome/accessibility-developer-tools/commit/df400939addf6dbc5f2a9e1d52a6219f356f82d8
// makes its way to npm
function patchCollectMatchingElements() {
    /**
     * Recursively collect elements which match |matcher| into |collection|,
     * starting at |node|.
     * @param {Node} node
     * @param {function(Element): boolean} matcher
     * @param {Array.<Element>} collection
     * @param {ShadowRoot=} opt_shadowRoot The nearest ShadowRoot ancestor, if any.
     */
    axs.AuditRule.collectMatchingElements = function(node, matcher, collection,
                                                       opt_shadowRoot) {
        if (node.nodeType === Node.ELEMENT_NODE)
            var element = /** @type {Element} */ (node);

        if (element && matcher.call(null, element))
            collection.push(element);

        // Descend into node:
        // If it has a ShadowRoot, ignore all child elements - these will be picked
        // up by the <content> or <shadow> elements. Descend straight into the
        // ShadowRoot.
        if (element) {
            // NOTE: grunt qunit DOES NOT support Shadow DOM, so if changing this
            // code, be sure to run the tests in the browser before committing.
            var shadowRoot = element.shadowRoot || element.webkitShadowRoot;
            if (shadowRoot) {
                axs.AuditRule.collectMatchingElements(shadowRoot,
                                                        matcher,
                                                        collection,
                                                        shadowRoot);
                return;
            }
        }

        // If it is a <content> element, descend into distributed elements - descend
        // into distributed elements - these are elements from outside the shadow
        // root which are rendered inside the shadow DOM.
        if (element && element.localName == 'content') {
            var content = /** @type {HTMLContentElement} */ (element);
            var distributedNodes = content.getDistributedNodes();
            for (var i = 0; i < distributedNodes.length; i++) {
                axs.AuditRule.collectMatchingElements(distributedNodes[i],
                                                        matcher,
                                                        collection,
                                                        opt_shadowRoot);
            }
            return;
        }

        // If it is a <shadow> element, descend into the olderShadowRoot of the
        // current ShadowRoot.
        if (element && element.localName == 'shadow') {
            var shadow = /** @type {HTMLShadowElement} */ (element);
            if (!opt_shadowRoot) {
                console.warn('ShadowRoot not provided for', element);
            } else {
                var distributedNodes = shadow.getDistributedNodes();
                for (var i = 0; i < distributedNodes.length; i++) {
                    axs.AuditRule.collectMatchingElements(distributedNodes[i],
                                                            matcher,
                                                            collection,
                                                            opt_shadowRoot);
                }
            }
        }

        // If it is neither the parent of a ShadowRoot, a <content> element, nor
        // a <shadow> element recurse normally.
        var child = node.firstChild;
        while (child != null) {
            axs.AuditRule.collectMatchingElements(child,
                                                    matcher,
                                                    collection,
                                                    opt_shadowRoot);
            child = child.nextSibling;
        }
    };
}
/*eslint-enable*/

// Audits for a single rule (by name) and returns the results for only that
// rule
function audit(ruleName) {
    let whitelist = createWhitelist(ruleName);

    patchCollectMatchingElements();

    return axs.Audit.run(whitelist)
        .filter(result => result.rule.name === ruleName)[0];
}

module.exports = audit;
