/**
Goal
  keep this file minimal
  Socket always listening
**/
import { PORT, DEV_RESTART_CODE } from "share/config"
import express from "express"
import bodyParser from 'body-parser'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { handleServerError } from "./middleware/killswitch"


process.on('uncaughtException', (exception) => {
  console.error("Unhandle", exception);
  process.exit(1);
});

let router = require("./router").default
var subscriptionManager = require("./graphql/subscriptionManager").default

let app = new express()
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use((...args) => router(...args))

let server = app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
}).on('error', handleServerError)

new SubscriptionServer({
  // subscriptionManager
  subscriptionManager: {
    subscribe: (...args) => subscriptionManager.subscribe(...args),
    unsubscribe: (...args) => subscriptionManager.unsubscribe(...args)
  },
}, server);

if (module.hot) {
  try {
    module.hot.status(event => {
      if (event === 'abort' || event === 'fail') {
        process.exit(DEV_RESTART_CODE);
      }
    });

    module.hot.accept();

    module.hot.accept("./router", () => {
      router = require("./router").default
    })

    module.hot.accept("./graphql/subscriptionManager", () => {
      subscriptionManager = require("./graphql/subscriptionManager").default
    })

  } catch (exception) {
    console.log(exception)
  }
}