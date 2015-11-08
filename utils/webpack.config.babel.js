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

let bannerTemplate = handlebars.compile(
    fs.readFileSync("./templates/banner.handlebars", "utf-8"));

module.exports = {
    entry: {
        app: "./index-react.js",
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
                version: require("../package.json").version,
                date: new Date().toISOString().slice(0, 10),
            }),
            {entryOnly: true}),
    ],
    postcss: [veryimportant],
};
