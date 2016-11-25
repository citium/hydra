import { createBatchingNetworkInterface } from 'apollo-client'
import { print } from 'graphql-tag/printer';
import { Client } from 'subscriptions-transport-ws';
import createApolloClient from 'share/createApolloClient'

const networkInterface = createBatchingNetworkInterface({
  opts: {
    credentials: "same-origin",
  },
  batchInterval: 10,
  uri: "/graphql?",
});

const webSocketClient = new Client(window.location.origin.replace(/^http/, 'ws'))

networkInterface.subscribe = function(request, handler) {
  return webSocketClient.subscribe({
    query: print(request.query),
    variables: request.variables,
  }, handler);
}

networkInterface.unsubscribe = webSocketClient.unsubscribe

export default createApolloClient(networkInterface);
