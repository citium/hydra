var webpack = require('webpack')
var merge = require('webpack-merge');
var _ = require("lodash")

var {BUILD_DIR} = require("../../src/config")
var {reporter, titleLog, getStats} = require("../utility")
var client = require("./client")
var webpackConfig = require("../../webpack/server.js")
var api = require("./api")
var fs = require("fs")
var path = require("path")

var log = titleLog("Server")
var compiler
var watcher
var assets = []

function stop() {
  if (watcher) {
    watcher.close()
  }
}

function cleanUpOldAssets(stats) {
  assets = stats.assets
    .map(asset => asset.name)
  fs.readdir(path.join(BUILD_DIR), (err, items) => {
    items = items.filter(item => item.indexOf("hot-update") != -1)
    items.forEach(item => {
      if (assets.indexOf(item) === -1) {
        fs.unlinkSync(path.join(BUILD_DIR, item))
      }
    })
  })
}

function getConfig() {
  var config = merge(webpackConfig, {
    debug: true,
    entry: {
      server: ["webpack/hot/signal.js"]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ]
  })
  return config;
}

function start() {
  stop()
  var config = getConfig()
  compiler = webpack(config)
  compiler.plugin('done', reporter(log))
  compiler.plugin('done', (statsResult) => {
    let stats = getStats(statsResult)
    if (stats) {
      api.restart()
      cleanUpOldAssets(stats)
    }
  })

  watcher = compiler.watch({
    aggregateTimeout: 10,
    poll: 10
  }, client.notified)
  _.merge(module.exports, {
    compiler,
    watcher
  })
}

function restart() {
  start()
}

module.exports = {
  watcher,
  compiler,
  start,
  restart
}
