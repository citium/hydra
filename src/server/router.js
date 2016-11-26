import express from 'express'
import { PUBLIC_DIR } from "config"

var httpProxy = require('http-proxy');


let mongo = __DEV__ ? require("./middleware/mongo").default : undefined
let killswitch = __DEV__ ? require("./middleware/killswitch").default : undefined
let graphiql = __DEV__ ? require("./middleware/graphiql").default : undefined
let graphql = require("./middleware/graphql").default
let isomorphic = require("./middleware/isomorphic").default


const router = express()

router.use("/graphql", (...arg) => graphql(...arg))


if (__DEV__) {
  router.use("/ERROR_ADDRESS_IN_USE", (...arg) => killswitch(...arg))
  router.use("/mongo", (...arg) => mongo(...arg))
  router.use("/graphiql", (...arg) => graphiql(...arg))

  var hp = new httpProxy.createProxyServer({
    target: "http://127.0.0.1:3001",
    ws: true,
  });

  router.use("/__webpack_hmr", (req, res) => {
    req.url = "/__webpack_hmr" + req.url.substr(1)

    hp.web(req, res)
  })

  router.on('upgrade', function(req, socket, head) {
    hp.ws(req, socket, head);
  });

  router.use("/", express.static(PUBLIC_DIR))

// router.use("/js", (req, res) => {
//   req.url = "/js" + req.url
//   hp.web(req, res)
// })
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
