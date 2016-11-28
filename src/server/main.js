/**
Goal
  keep this file minimal
  Socket always listening
**/
import { SERVER_PORT, DEV_RESTART_CODE } from "config"
import express from "express"
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'
// import uuid from 'node-uuid'
// import connectMongo from 'connect-mongo';

import { SubscriptionServer } from 'subscriptions-transport-ws'
import { handleServerError } from "./middleware/killswitch"

import "./mongo/connect"
import "./passport"

// const MongoStore = connectMongo(session)

process.on('uncaughtException', (exception) => {
  console.error("Unhandle", exception);
  process.exit(1);
});

let router = require("./router").default
var subscriptionManager = require("./graphql/subscriptionManager").default

let app = new express()
let server = app.listen(SERVER_PORT, () => {
  console.log(`Listening on ${SERVER_PORT}`)
}).on('error', handleServerError)

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'mysecret'
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((...args) => router(...args))

new SubscriptionServer({
  subscriptionManager: {
    subscribe: (...args) => subscriptionManager.subscribe(...args),
    unsubscribe: (...args) => subscriptionManager.unsubscribe(...args)
  },
}, server);

//#region Hot Mode Reload
if (module.hot) {
  try {
    module.hot.status(event => {
      if (event === 'abort' || event === 'fail') {
        console.log(event)
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

  // module.hot.accept("./mongo/connect", () => {
  //   require("./mongo/connect")
  // })
  //
  } catch (exception) {
    console.log(exception)
  }
}
//#endregion
