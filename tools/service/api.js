var {spawn} = require('child_process')
var path = require("path")
var {titleLog} = require("../utility")
var _ = require("lodash")
var {BUILD_DIR, API_PORT} = require("../config")
var express = require("express")
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
var hotApiPath = path.join(BUILD_DIR, "server", "bundle.js");

function setupRouter() {
  var router = express()
  router.use("/ERROR_ADDRESS_IN_USE", proxy('/ERROR_ADDRESS_IN_USE', {
    target: 'http://localhost:3001',
  }))
  router.use("/mongos", proxy('/mongos', {
    target: 'http://localhost:3001'
  }))
  router.use("/graphql", proxy('/graphql', {
    target: 'http://localhost:3001'
  }))
  router.use("/graphiql", proxy('/graphiql', {
    target: 'http://localhost:3001'
  }))

  var wsProxy = proxy(`ws://localhost:${API_PORT}`, {
    changeOrigin: true
  });

  router.use(wsProxy);
  router.on("upgrade", wsProxy.upgrade)
  return router
}
var router = setupRouter();

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
      server = spawn('node', [hotApiPath], getEnviroment())
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
  router
}
