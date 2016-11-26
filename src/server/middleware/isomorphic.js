import React from 'react'
import ReactDOM from 'react-dom/server'
import { createBatchingNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { getDataFromTree } from 'react-apollo/server'
import { match, RouterContext } from 'react-router'
import routes from 'share/route'
import createApolloClient from "share/createApolloClient"
import Html from 'share/components/html'


import { SERVER_PORT } from "config"

const apiUrl = `http://localhost:${SERVER_PORT}/graphql`

export default function isomorphic(req, res) {
  match({
    routes,
    location: req.originalUrl
  }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (error) {
      console.error('ROUTER ERROR:', error)
      res.status(500)
    } else if (renderProps) {
      const client = createApolloClient(createBatchingNetworkInterface({
        uri: apiUrl,
        opts: {
          credentials: "same-origin",
          headers: req.headers,
        },
        batchInterval: 1,
      }))

      const component = (
      <ApolloProvider client={client}>
          <RouterContext {...renderProps} />
        </ApolloProvider>
      )
      getDataFromTree(component).then(() => {
        res.status(200)
        const html = ReactDOM.renderToString(component)
        let state = {
          apollo: {
            data: client.store.getState().apollo.data
          }
        }
        const page = <Html content={html} state={state} />
        const text = ReactDOM.renderToStaticMarkup(page);
        res.end("<!doctype html>" + text)
      }).catch(e => console.error('RENDERING ERROR:', e))
    } else {
      res.status(404).send('Not found')
    }
  })
}
