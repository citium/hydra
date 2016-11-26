global.__SERVER__ = true
global.__CLIENT__ = true

var client = require("./service/client")
var server = require("./service/server")
var vendor = require("./service/vendor")

client.start()
server.start()
vendor.start()
vendor.build()
