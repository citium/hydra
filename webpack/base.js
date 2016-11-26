var path = require("path");
var webpack = require("webpack");

const config = {
  output: {
    path: path.resolve(__dirname, "..", "build"),
  },
  context: path.resolve(__dirname, ".."),
  module: {
    // preLoaders: [
    //   {
    //     test: /\.(js|jsx)$/,
    //     loader: 'eslint',
    //     include: path.resolve(__dirname, "..", "..", "src"),
    //   }
    // ],
    noParse: [],
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel?cacheDirectory=build/cache',
        exclude: /(node_modules)/,
      }, {
        test: /\.json$/,
        loader: 'json'
      }, {
        test: /\.(woff2?|svg)$/,
        loader: 'url?name=./assets/[hash].[ext]&limit=10000'
      }, {
        test: /\.(ttf|eot)$/,
        loader: 'file?name=./assets/[hash].[ext]'
      }, {
        test: /\.gql/,
        loader: 'raw'
      }
    ]
  },
  resolve: {
    root: path.resolve(__dirname, '../'),
    extensions: ['', '.js', '.scss'],
    modulesDirectories: ['node_modules', 'src'],
  },
  plugins: [
    new webpack.DefinePlugin(Object.assign({
      __DEV__: true,
    }))

  ]
}

module.exports = config;
