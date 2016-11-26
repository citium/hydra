var base_config = require("./base");
var merge = require('webpack-merge');
var webpack = require("webpack")
var path = require("path")

module.exports = merge(base_config, {
  entry: {
    app: ["./src/client/main.js"]
  },
  output: {
    path: path.resolve('public', "js"),
    filename: "client-bundle.js",
    library: 'app',
    publicPath: "/js/"
  },
  externals: {
    "react-bootstrap": "ReactBootstrap",
    "react": "React",
    "react-dom": "ReactDOM",
  },
  plugins: [
    new webpack.DefinePlugin(Object.assign({
      __CLIENT__: true,
      __SERVER__: false,
    }))
  ]
})
