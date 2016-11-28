import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { Router, browserHistory } from 'react-router'
import routes from 'share/route'
import apolloClient from './apolloClient'

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={apolloClient}>
          <Router history={browserHistory}>
            {routes}
          </Router>
      </ApolloProvider>
      );
  }
}
