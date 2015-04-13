var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: "./js/index.js",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "tota11y.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
            { test: /\.handlebars$/, loader: "handlebars-loader" }
        ]
    }
};
