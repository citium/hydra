var {spawn} = require('child_process')
var {titleLog} = require("../utility")
var _ = require("lodash")
var {API_PORT, SERVER_BUNDLE_PATH} = require("../../src/config")
var proxy = require('http-proxy-middleware')

var log = titleLog("RunApi")
var logChild = titleLog("HotApi")

var bufferLog = (buffer) => logChild(buffer.toString().trim())
proxy({
  target: 'http://localhost',
  logLevel: 'silent'
})
var server
var infinityData = {
  counter: [],
  limit: 10,
  duration: 5 * 1000
}

function checkInfinity() {
  let {counter, limit, duration} = infinityData
  let time = +new Date();
  counter.push(time + duration)
  while (counter[0] < time) {
    counter.shift()
  }
  return counter.length < limit
}

function getEnviroment() {
  var env = Object.create(process.env)
  env.NODE_ENV = 'DEV'
  env.PORT = API_PORT
  return {
    env
  }
}

function exitCondition(code) {
  server = undefined

  switch (code) {
    case 0:
      log("Code:0 Normal");
      break
    case 1:
      log("Code:1 Error");
      break
    case 250:
      log("Code:250 Restart");
      break
    case 251:
      log("Code:251 Socket Restart");
      break
    default:
      log(`Code:${code} Error`)
  }

  start()
}

function stop() {
  if (server) {
    server.kill('SIGUSR2')
    return false;
  } else {
    return true;
  }
}

function start() {
  if (stop()) {
    if (checkInfinity()) {
      log('HotApi: Starting')
      server = spawn('node', [SERVER_BUNDLE_PATH], getEnviroment())
      server.stdout.on('data', bufferLog)
      server.stderr.on('data', bufferLog)
      server.on('exit', exitCondition)
    } else {
      log("HotApi: Stoped, restart too excessively");
    }
  }
  _.merge(module.exports, {
    server
  })
}

function restart() {
  start()
}

module.exports = {
  start,
  stop,
  restart,
}
