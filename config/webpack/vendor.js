var base_config = require("./base");
var webpack = require("webpack");
var merge = require('webpack-merge');

module.exports = merge(base_config, {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    vendor: ["./config/vendor.js"],
  },
  output: {
    filename: "vendor_bundle.js",
    library: 'vendor',
  },
  plugins: [
    new webpack.DllPlugin({
      path: './build/vendor-manifest.json',
      name: 'vendor'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
  ]
})
