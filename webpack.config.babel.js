let fs = require("fs");
let handlebars = require("handlebars");
let path = require("path");
let postcss = require("postcss");
let webpack = require("webpack");

// PostCSS plugin to append !important to every CSS rule
let veryimportant = postcss.plugin("veryimportant", function() {
    return function(css) {
        css.eachDecl(function(decl) {
            decl.important = true;
        });
    };
});

// Tell babel to transform all JSX code into calls to this function. It can be
// anything!
const JSX_PRAGMA_FN = "buildElement";

let bannerTemplate = handlebars.compile(
    fs.readFileSync("./templates/banner.handlebars", "utf-8"));

module.exports = {
    entry: {
        app: "./index.js",
    },
    output: {
        path: path.join(__dirname, "build"),
        filename: "tota11y.min.js",
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel",
                query: {
                    jsxPragma: JSX_PRAGMA_FN,
                },
            },
            { test: /\.handlebars$/, loader: "handlebars", },
            {
                test: /\.less$/,
                loader: "style!css!postcss!autoprefixer?{browsers:['> 1%']}!less",
            },
        ],
    },
    plugins: [
        // Add a banner to our bundles with a version number, date, and
        // license info
        new webpack.BannerPlugin(
            bannerTemplate({
                version: require("./package.json").version,
                date: new Date().toISOString().slice(0, 10),
            }),
            {entryOnly: true}),

        // Make the JSX pragma function available everywhere without the need
        // to use "require"
        new webpack.ProvidePlugin({
            [JSX_PRAGMA_FN]: path.join(__dirname, "element"),
        }),
    ],
    postcss: [veryimportant],
};
