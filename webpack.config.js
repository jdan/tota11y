var fs = require("fs");
var handlebars = require("handlebars");
var path = require("path");
var postcss = require("postcss");
var webpack = require("webpack");

// PostCSS plugin to append !important to every CSS rule
var veryimportant = postcss.plugin("veryimportant", function() {
    return function(css) {
        css.eachDecl(function(decl) {
            decl.important = true;
        });
    };
});

var bannerTemplate = handlebars.compile(
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

        // Make the JSX pragma function "E" available everywhere without the
        // need to use "require"
        new webpack.ProvidePlugin({
            "E": path.join(__dirname, "element"),
        }),
    ],
    postcss: [veryimportant],
};
