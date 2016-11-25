var webpackDevMiddleware = require("webpack-dev-middleware")
var webpackHotMiddleware = require("webpack-hot-middleware")
var webpack = require('webpack')
var merge = require('webpack-merge');
var fs = require("fs")
var _ = require("lodash")
var path = require("path")
var {BUILD_DIR, PUBLIC_DIR} = require("../config")
var webpackConfig = require("../../config/webpack/client.js")
var {reporter, titleLog} = require("../utility")

var vendorManifest = path.join(BUILD_DIR, "vendor-manifest.json")
var log = titleLog("Client")
var compiler
var webpackDev
var webpackHot

function notified(err, statsResult) {
  if (webpackHot) {
    var stats = statsResult.toJson({
      errorDetails: false,
      source: false
    })
    webpackHot.publish({
      name: stats.name,
      action: 'built',
      time: stats.time,
      warnings: stats.warnings || [],
      errors: stats.errors || []
    })
  }
}

function stop() {
  if (webpackDev) {
    webpackDev.close()
  }
}

function start() {
  stop()

  var dllPlugin
  try {
    dllPlugin = new webpack.DllReferencePlugin({
      context: '.',
      manifest: JSON.parse(fs.readFileSync(vendorManifest).toString())
    })
  } catch (error) {
    log(`Fail to load DllReferencePlugin ${vendorManifest}`)
  }

  var config = merge(webpackConfig, {
    entry: {
      app: ["webpack-hot-middleware/client"]
    },
    plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NoErrorsPlugin(), dllPlugin].filter(n => n)
  })

  compiler = webpack(config)

  let webpackOption = {
    contentBase: PUBLIC_DIR,
    publicPath: "/",
    noInfo: true,
    quite: true,
    log: () => {
    },
  }

  webpackDev = webpackDevMiddleware(compiler, webpackOption)
  webpackHot = webpackHotMiddleware(compiler, webpackOption)

  compiler.plugin('done', reporter(log))

  _.assign(module.exports, {
    compiler,
    webpackHot,
    webpackDev
  })
}

function restart() {
  if (compiler) {
    start()
  }
}

module.exports = {
  compiler,
  webpackDev,
  webpackHot,
  restart,
  start,
  notified
}
