import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { Router, browserHistory } from 'react-router'
import routes from 'share/route'
import client from './client'

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router history={browserHistory}>
          {routes}
        </Router>
      </ApolloProvider>
      );
  }
}

if (module.hot) {
  module.hot.dispose(() => {
    window.__APOLLO_STATE__.apollo.data = client.store.getState().apollo.data
  })
}
