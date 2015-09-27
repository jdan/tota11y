/**
 * A function used by Babel to transpile JSX code into jQuery elements
 */
function buildElement(type, props, ...children) {
    // We need to require jQuery inside of this method because `require()`
    // will work different after mocha's magic "before" method runs.
    //
    // This allows us to use the jQuery instance provided by our jsdom
    // instance.
    let $ = require("jquery");

    // Is our element a TextNode?
    if (props === undefined) {
        // Type will be the text content, which can simply be returned here
        return type;

    // Is our element a Plugin?
    } else if (type.render) {
        // Render the plugin with the passed-in click handler
        return type.render(props && props.onClick);

    // Otherwise, build the element with jQuery
    } else {
        let $el = $("<" + type + ">");

        // Iterate through props
        if (props !== null) {
            for (let propName in props) {
                // onClick gets turned into a jQuery event handler
                // TODO: Handle props like onHover, onFocus, etc.
                if (propName === "onClick") {
                    let handler = props[propName];
                    $el.click(handler);

                // Some passed-in props need to be set with $.attr
                // Currently we do this for role and aria-*
                } else if (/^aria-/.test(propName) || propName === "role") {
                    let value = props[propName];
                    $el.attr(propName, value);

                // All other props can go right to $.prop
                } else {
                    let value = props[propName];
                    $el.prop(propName, value);
                }
            }
        }

        // Recurse through the children and append each resulting element to
        // the parent
        children.forEach((child) => {
            $el.append(buildElement(child));
        });

        return $el;
    }
}

module.exports = buildElement;
