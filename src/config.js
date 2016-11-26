var path = require("path")

const SERVER_PORT = 3000
const WEBPACK_PORT = 3001

const ROOT_DIR = path.join(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const BUILD_DIR = path.join(ROOT_DIR, "build");
const SOURCE_DIR = path.join(ROOT_DIR, "src");

const HOTAPI_PATH = path.join(BUILD_DIR, "server_bundle.js");
const VENDOR_MANIFEST_PATH = path.join(PUBLIC_DIR, "js", "vendor-manifest.json");
const SERVER_BUNDLE_PATH = path.join(BUILD_DIR, "server-bundle.js");
const VENDOR_ENTRY_PATH = path.join(ROOT_DIR, "webpack", "vendor-entry.js");

const DEV_SOCKET_CODE = 251
const DEV_RESTART_CODE = 250

module.exports = {
  SERVER_PORT,
  WEBPACK_PORT,
  PUBLIC_DIR,
  BUILD_DIR,
  SOURCE_DIR,
  VENDOR_ENTRY_PATH,
  HOTAPI_PATH,
  VENDOR_MANIFEST_PATH,
  SERVER_BUNDLE_PATH,
  DEV_RESTART_CODE,
  DEV_SOCKET_CODE
}
