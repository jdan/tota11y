let fs = require("fs");
let handlebars = require("handlebars");
let path = require("path");
let postcss = require("postcss");
let webpack = require("webpack");
let autoprefixer = require("autoprefixer");

let options = require("./utils/options");

// PostCSS plugin to append !important to every CSS rule
let veryimportant = postcss.plugin("veryimportant", function() {
    return function(css) {
        css.walkDecls(function(decl) {
            decl.important = true;
        });
    };
});

let bannerTemplate = handlebars.compile(
    fs.readFileSync("./templates/banner.handlebars", "utf-8"));

const plugins = [
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
        [options.jsxPragma]: path.join(__dirname, "utils", "element"),
    }),
];

if (process.env.NODE_ENV === "production") {
    plugins.push(
        // Suppress uglifyJS warnings from node_modules/
        new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
    )
}

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
                    jsxPragma: options.jsxPragma,
                },
            },
            { test: /\.handlebars$/, loader: "handlebars", },
            {
                test: /\.less$/,
                loader: "style!css!postcss!less",
            },
        ],
    },
    plugins,
    postcss: [
        veryimportant,
        autoprefixer({browsers: ["> 1%"]}),
    ],
};
