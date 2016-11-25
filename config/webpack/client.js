var base_config = require("./base");
var merge = require('webpack-merge');
var webpack = require("webpack")

module.exports = merge(base_config, {
  entry: {
    app: ["./src/client/main.js"]
  },
  output: {
    filename: "client_bundle.js",
    library: 'app',
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
      __DEV__: true
    }))
  ]
})
