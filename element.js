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
    }

    // Create a jQuery element
    let $el = $("<" + type + ">");

    // Iterate through props
    if (props !== null) {
        for (let propName in props) {
            // onClick gets turned into a jQuery event handler
            // TODO: Handle props like onHover, onFocus, etc.
            if (propName === "onClick") {
                let handler = props[propName];
                $el.click(handler);
            } else {
                let value = props[propName];
                $el.prop(propName, value);
            }
        }
    }

    // Recurse through the children and append each resulting element to the
    // parent
    children.forEach((child) => {
        $el.append(buildElement(child));
    });

    return $el;
}

module.exports = buildElement;
