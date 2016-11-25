var webpack = require('webpack')
var merge = require('webpack-merge');
var _ = require("lodash")

var {watchOptions} = require("../config")
var {reporter, titleLog, getStats} = require("../utility")
var client = require("./client")
var webpackConfig = require("../../config/webpack/server.js")
var api = require("./api")

var log = titleLog("Server")
var compiler
var watcher

function stop() {
  if (watcher) {
    watcher.close()
  }
}

function start() {
  stop()

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

  compiler = webpack(config)
  compiler.plugin('done', reporter(log))
  compiler.plugin('done', (statsResult) => {
    if (getStats(statsResult)) {
      api.restart()
    }
  })

  watcher = compiler.watch(watchOptions, client.notified)
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
