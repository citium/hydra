import { createBatchingNetworkInterface } from 'apollo-client'
import { print } from 'graphql-tag/printer';
import { Client } from 'subscriptions-transport-ws';
import createApolloClient from 'share/createApolloClient'
// var stringifyObject = require("stringify-object")

const networkInterface = createBatchingNetworkInterface({
  opts: {
    credentials: "same-origin",
  },
  batchInterval: 10,
  uri: "/graphql?",
});

const webSocketClient = new Client(window.location.origin.replace(/^http/, 'ws'), {
  reconnect: true
})

networkInterface.subscribe = function(request, handler) {
  return webSocketClient.subscribe({
    query: print(request.query),
    variables: request.variables,
  }, handler);
}

networkInterface.unsubscribe = function(id) {
  webSocketClient.unsubscribe(id)
}

export default createApolloClient(networkInterface);
