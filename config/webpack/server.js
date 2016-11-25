var base_config = require("./base");
var path = require("path")
var webpack = require("webpack")
var nodeExternals = require('webpack-node-externals');
var merge = require('webpack-merge');


module.exports = merge(base_config, {
  target: 'node',
  node: {
    __dirname: true,
    __filename: true
  },
  entry: {
    "server": ["./src/server/main.js"]
  },
  externals: [
    nodeExternals({
      whitelist: /(webpack)/
    })],
  output: {
    path: path.resolve(__dirname, "..", "..", 'build', "server"),
    filename: "bundle.js"
  },
  plugins: [
    new webpack.DefinePlugin(Object.assign({
      __CLIENT__: false,
      __SERVER__: true,
      __DEV__: true
    }))
  ]
})
