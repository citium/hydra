var express = require("express")
var path = require("path")
var client = require("./service/client")
var server = require("./service/server")
var vendor = require("./service/vendor")
var chalk = require("chalk")
var api = require("./service/api")
var {titleLog} = require("./utility")

var log = titleLog("Webpack")

client.start()
server.start()
vendor.start()
// vendor.build()

var {PORT, PUBLIC_DIR} = require("./config")

const app = express()
app.listen(PORT, () => {
  log(`Listening on http://localhost:${PORT}/`)
}).on("error", (err) => {
  if (err.errno === 'EADDRINUSE') {
    log(chalk.red.bold(`Port already in use ${PORT}`))
    process.exit()
  } else {
    log(err)
  }
})


const publicDirector = express.static(PUBLIC_DIR)
function defaultRoute(req, res) {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'))
}

app.use((...args) => client.webpackDev(...args))
app.use((...args) => client.webpackHot(...args))
app.use(api.router)
app.use("/", publicDirector)
app.use(defaultRoute)
