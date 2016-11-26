var base_config = require("./base");
var webpack = require("webpack");
var merge = require('webpack-merge');
var path = require("path")

module.exports = merge(base_config, {
  entry: {
    vendor: ["./webpack/vendor-entry.js"],
  },
  output: {
    path: path.join('public', "js"),
    filename: "vendor-bundle.js",
    library: 'vendor',
    publicPath: "/"
  },
  externals: {
    "react-bootstrap": "ReactBootstrap",
    "react": "React",
    "react-dom": "ReactDOM",
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join('public', "js", "vendor-manifest.json"),
      name: 'vendor'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
  ]
})
