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

const webSocketClient = new Client(window.location.origin.replace(/^http/, 'ws'), {
  reconnect: true
})

//Hook Websocket into the networkInterface
networkInterface.subscribe = function(request, handler) {
  return webSocketClient.subscribe({
    query: print(request.query),
    variables: request.variables,
  }, handler);
}
networkInterface.unsubscribe = function(id) {
  webSocketClient.unsubscribe(id)
}

const apolloClient = createApolloClient(networkInterface);
export default apolloClient

//#region Hot Module Replace
if (module.hot) {
  module.hot.dispose(() => {
    //Store the state so that react-apollo could rerender with the current state
    window.__APOLLO_STATE__.apollo.data = apolloClient.store.getState().apollo.data
  })
}
//#endregion
