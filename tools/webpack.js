var express = require("express")
var path = require("path")
var client = require("./service/client")
var server = require("./service/server")
var vendor = require("./service/vendor")
var api = require("./service/api")

client.start()
server.start()
vendor.start()
// vendor.build()

var {PORT, PUBLIC_DIR} = require("./config")

const app = express()
app.listen(PORT)

const publicDirector = express.static(PUBLIC_DIR)
function defaultRoute(req, res) {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'))
}

app.use((...args) => client.webpackDev(...args))
app.use((...args) => client.webpackHot(...args))
app.use(api.router)
app.use("/", publicDirector)
app.use(defaultRoute)
