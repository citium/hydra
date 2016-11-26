import React from 'react'
import ReactDOM from 'react-dom/server'
import { createBatchingNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { getDataFromTree } from 'react-apollo/server'
import { match, RouterContext } from 'react-router'
import routes from 'share/route'
import createApolloClient from "share/createApolloClient"
import Html from 'share/components/html'

import { GRAPHQL_URL } from "config"

export default async function isomorphic(req, res) {
  match({
    routes,
    location: req.originalUrl
  }, async (err, redirectLocation, renderProps) => {
    if (err) {
      res.status(500).end('Server Error: Route')
      console.error('isomorphic, route:', err)
    } else if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      const client = getApolloClient(req)

      const component = (
      <ApolloProvider client={client}>
          <RouterContext {...renderProps} />
        </ApolloProvider>
      )

      try {
        await getDataFromTree(component)
      } catch (err) {
        res.status(500).end('Server Error: Graphql')
        console.error('isomorphic, graphql:', err)
      }

      res.status(200)
      const html = ReactDOM.renderToString(component)
      const page = <Html content={html} state={getCleanApolloState(client)} />
      const text = ReactDOM.renderToStaticMarkup(page);
      res.end("<!doctype html>" + text)
    } else {
      res.status(404).end('Not found')
    }
  })
}

function getCleanApolloState(client) {
  return {
    apollo: {
      data: client.store.getState().apollo.data
    }
  }
}

function getApolloClient(req) {
  return createApolloClient(createBatchingNetworkInterface({
    uri: GRAPHQL_URL,
    opts: {
      credentials: "same-origin",
      headers: req.headers,
    },
    batchInterval: 1,
  }))
}
