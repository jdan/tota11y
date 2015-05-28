var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: "./index.js",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "tota11y.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel" },
            { test: /\.handlebars$/, loader: "handlebars" },
            { test: /\.less$/, loader: "style!css!autoprefixer?{browsers:['> 1%']}!less" }
        ]
    }
};
