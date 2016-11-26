var webpack = require('webpack')
var merge = require('webpack-merge');
var fs = require("fs")
var _ = require("lodash")
var {PUBLIC_DIR, VENDOR_MANIFEST_PATH} = require("../../src/config")
var webpackConfig = require("../../webpack/client.js")
var {reporter, titleLog} = require("../utility")

var log = titleLog("Client")
var compiler
var webpackDev
var webpackHot
var expressApp
var config

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
    webpackDev = undefined
    webpackHot = undefined
  }
}


function startExpress() {
  if (expressApp == undefined) {

    var {WEBPACK_PORT} = require("../../src/config")

    var express = require("express")
    var chalk = require("chalk")

    expressApp = express()
    expressApp.listen(WEBPACK_PORT).on("error", (err) => {
      if (err.errno === 'EADDRINUSE') {
        log(chalk.red.bold(`Hot reload client server: error port in use ${WEBPACK_PORT}`))
        process.exit()
      } else {
        log(err)
      }
    })

    expressApp.use((...args) => webpackDev(...args))
    expressApp.use((...args) => webpackHot(...args))
  }
}

// var path = require("path")
// var {getStats} = require("../utility")
//
// function exportAssets(statsResult) {
//   let stats = getStats(statsResult)
//   if (stats) {
//     let assets = stats.assets
//       .map(asset => asset.name)
//
//     assets.forEach(asset => {
//       let location = path.join(config.output.path, asset)
//       webpackDev.fileSystem.readFile(location, (err, data) => {
//         if (!err) {
//           fs.writeFile(location, data, (err) => {
//             if (err) console.log(err)
//           })
//         }
//       })
//     })
//
//     fs.readdir(path.join(config.output.path), (err, items) => {
//       items = items.filter(item => item.indexOf("hot-update") != -1)
//       items.forEach(item => {
//         if (assets.indexOf(item) === -1) {
//           fs.unlinkSync(path.join(config.output.path, item))
//         }
//       })
//     })
//   }
// }

function useMiddleWare() {
  startExpress()
  var dllPlugin
  try {
    dllPlugin = new webpack.DllReferencePlugin({
      context: '.',
      manifest: JSON.parse(fs.readFileSync(VENDOR_MANIFEST_PATH).toString())
    })
  } catch (error) {
    log(`Fail to load DllReferencePlugin ${VENDOR_MANIFEST_PATH}`)
  }

  config = merge(webpackConfig, {
    entry: {
      app: ["webpack-hot-middleware/client"]
    },
    plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NoErrorsPlugin(), dllPlugin].filter(n => n)
  })

  compiler = webpack(config)
  compiler.plugin('done', reporter(log))

  // compiler.plugin('done', exportAssets)
  let webpackOption = {
    contentBase: PUBLIC_DIR,
    publicPath: '/js',
    noInfo: true,
    quite: true,
    log: () => {
    },
  }

  var webpackDevMiddleware = require("webpack-dev-middleware")
  var webpackHotMiddleware = require("webpack-hot-middleware")
  webpackDev = webpackDevMiddleware(compiler, webpackOption)
  webpackHot = webpackHotMiddleware(compiler, webpackOption)

  _.assign(module.exports, {
    compiler,
    webpackHot,
    webpackDev
  })
}

function start() {
  stop()
  useMiddleWare()
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
