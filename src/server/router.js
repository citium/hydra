import express from 'express'
import httpProxy from 'http-proxy'
import { PUBLIC_DIR } from "config"

let graphql = require("./middleware/graphql").default
let isomorphic = require("./middleware/isomorphic").default

//#region Hot Module Reload
if (module.hot) {
  try {
    module.hot.accept("./middleware/graphql", () => {
      graphql = require("./middleware/graphql").default
    })
    module.hot.accept("./middleware/isomorphic", () => {
      isomorphic = require("./middleware/isomorphic").default
    })
  } catch (e) {
    console.error(e)
  }
}
//#endregion

const router = express()
router.use("/graphql", (...arg) => graphql(...arg))
router.use("/", express.static(PUBLIC_DIR))

//#region DEV_
if (__DEV__) {
  let mongo = __DEV__ ? require("./middleware/mongo").default : undefined
  let killswitch = __DEV__ ? require("./middleware/killswitch").default : undefined
  let graphiql = __DEV__ ? require("./middleware/graphiql").default : undefined
  //#region Hot Module Reload
  if (module.hot) {
    try {
      module.hot.accept("./middleware/graphiql", () => {
        graphiql = require("./middleware/graphiql").default
      })
      module.hot.accept("./middleware/mongo", () => {
        mongo = require("./middleware/mongo").default
      })
    } catch (e) {
      console.error(e)
    }
  }
  //#endregion

  router.use("/ERROR_ADDRESS_IN_USE", (...arg) => killswitch(...arg))
  router.use("/mongo", (...arg) => mongo(...arg))
  router.use("/graphiql", (...arg) => graphiql(...arg))
  var proxy = new httpProxy.createProxyServer({
    target: "http://127.0.0.1:3001",
    ws: true,
  });
  router.use("/__webpack_hmr", (req, res) => {
    req.url = "/__webpack_hmr" + req.url.substr(1)
    proxy.web(req, res)
  })
  router.on('upgrade', function(req, socket, head) {
    proxy.ws(req, socket, head);
  });
  router.use("/js", (req, res) => {
    req.url = "/js" + req.url
    proxy.web(req, res)
  })
}
//#endregion __DEV__

router.use((...arg) => isomorphic(...arg))


export default router
