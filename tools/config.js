var path = require("path")

const PORT = 3000
const API_PORT = 3001
const ROOT_DIR = path.join(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const BUILD_DIR = path.join(ROOT_DIR, "build");
const SOURCE_DIR = path.join(ROOT_DIR, "src");

const watchOptions = {
  aggregateTimeout: 10,
  poll: 10
}

module.exports = {
  PORT,
  API_PORT,
  PUBLIC_DIR,
  SOURCE_DIR,
  BUILD_DIR,
  ROOT_DIR,
  watchOptions
}
