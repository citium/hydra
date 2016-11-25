import proxy from 'http-proxy-middleware'
import express from 'express'
import path from "path"

const PUBLIC_DIR = path.resolve(__dirname, "../../public")
const BUILD_DIR = path.resolve(__dirname, "../../build")


let mongo = __DEV__ ? require("./middleware/mongo").default : undefined
let killswitch = __DEV__ ? require("./middleware/killswitch").default : undefined
let graphiql = __DEV__ ? require("./middleware/graphiql").default : undefined
let graphql = require("./middleware/graphql").default
let isomorphic = require("./middleware/isomorphic").default

//Silence the proxy log
proxy({
  target: 'http://localhost',
  logLevel: 'silent'
})

const router = express()

router.use("/graphql", (...arg) => graphql(...arg))
router.use("/", express.static(PUBLIC_DIR))

if (__DEV__) {
  router.use("/ERROR_ADDRESS_IN_USE", (...arg) => killswitch(...arg))
  router.use("/mongo", (...arg) => mongo(...arg))
  router.use("/graphiql", (...arg) => graphiql(...arg))
  router.use("/__webpack_hmr", proxy({
    target: 'http://localhost:3000'
  }))
  router.use("/client_bundle.js", proxy('/client_bundle.js', {
    target: 'http://localhost:3000'
  }))
  router.use("/vendor_bundle.js", (req, res) => {
    res.sendFile(path.join(BUILD_DIR, 'vendor_bundle.js'))
  })
  router.use("/*hot-update.*", proxy({
    target: 'http://localhost:3000'
  }))
}

router.use((...arg) => isomorphic(...arg))

if (module.hot) {
  try {
    module.hot.accept("./middleware/graphql", () => {
      graphql = require("./middleware/graphql").default
    })
    module.hot.accept("./middleware/isomorphic", () => {
      isomorphic = require("./middleware/isomorphic").default
    })
    if (__DEV__) {
      module.hot.accept("./middleware/graphiql", () => {
        graphiql = require("./middleware/graphiql").default
      })
      module.hot.accept("./middleware/mongo", () => {
        mongo = require("./middleware/mongo").default
      })
    }
  } catch (e) {
    console.error(e)
  }
}

export default router
