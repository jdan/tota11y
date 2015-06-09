var path = require("path");
var postcss = require("postcss");
var webpack = require("webpack");

// PostCSS plugin to append !important to every CSS rule
var veryimportant = postcss.plugin("veryimportant", function() {
    return function(css) {
        css.eachDecl(function (decl) {
            decl.important = true;
        });
    };
});

module.exports = {
    entry: {
        app: "./index.js"
    },
    output: {
        path: path.join(__dirname, "build"),
        filename: "tota11y.min.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel" },
            { test: /\.handlebars$/, loader: "handlebars" },
            {
                test: /\.less$/,
                loader: "style!css!postcss!autoprefixer?{browsers:['> 1%']}!less"
            }
        ]
    },
    postcss: [veryimportant]
};
