var webpack = require('webpack')
var fs = require("fs")
var _ = require("lodash")
var client = require("./client")
var {ROOT_DIR, VENDOR_ENTRY_PATH} = require("../../src/config")
var {titleLog, getStats} = require("../utility")
// var {reporter} = require("../utility")
var webpackConfig = require("../../webpack/vendor.js");

var log = titleLog("Vendor")
var compiler
var compileGuard = ""
var vendorFile = VENDOR_ENTRY_PATH

function updateExternalModule(data) {
  try {
    fs.writeFileSync(vendorFile, data)
  } catch (error) {
    log(`Failed to write ${vendorFile}`)
  }
}

function resetCompileGuard() {
  try {
    compileGuard = fs.readFileSync(vendorFile).toString()
  } catch (error) {
    compileGuard = ""
  }
}

function extractExternalModule(stats) {
  return stats.modules
    .filter(filterReasonName)
    .map(module => wrapRequire(module))
    .sort()
    .join("\n")

  function filterReasonName(module) {
    function nameCheck(name) {
      return name.substr(0, 4) === "./~/" || name.substr(0, 9) === "delegated"
    }
    let reasons = module.reasons.filter((reason) => {
      return !nameCheck(reason.module);
    })
    return reasons.length && nameCheck(module.name);
  }

  function wrapRequire(module) {
    let name;
    if (module.identifier[0] == '/') {
      name = module.identifier.replace(ROOT_DIR, ".");
    } else {
      name = module.name.split(" ")[1]
    }
    name = name.split("node_modules/")[1]
    return `require("${name}")`
  }
}

function checkClientModule(statsResult) {
  const stats = getStats(statsResult)
  if (stats) {
    let externalModule = extractExternalModule(stats)
    if (externalModule !== compileGuard) {
      compileGuard = externalModule
      updateExternalModule(externalModule)
      build()
    }
  }
}

function hookClientCompilerDone() {
  if (client.compiler) {
    client.compiler.plugin('done', checkClientModule)
  }
}

function compileDone(statsResult) {
  const stats = getStats(statsResult)
  if (stats) {
    log(`Time: ${stats.time}ms`)
    log(`Module Packed: ${stats.modules.length}`)
    client.restart();
    hookClientCompilerDone()
  }
}

function stop() {
  compiler = null
  _.merge(module.exports, {
    compiler,
  })
}

function start() {
  stop()
  resetCompileGuard()
  compiler = webpack(webpackConfig)
  // compiler.plugin('done', reporter(log))
  compiler.plugin('done', compileDone)
  hookClientCompilerDone()
  _.merge(module.exports, {
    compiler,
    webpackConfig,
  })
}

function restart() {
  start()
}

function build() {
  if (compiler) {
    compiler.run(client.notified)
  }
}

module.exports = {
  webpackConfig,
  compiler,
  start,
  restart,
  stop,
  build
}
