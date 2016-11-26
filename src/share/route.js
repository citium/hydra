import React from 'react'
import { Route, IndexRedirect } from 'react-router'

import Counter from 'share/components/counter'
import App from 'share/components/app'

import Admin from "./admin/route"

export default (
[
  <Route key="counter" path="/" component={App}>
    <IndexRedirect to="/counter" />
    <Route path="counter" component={Counter} />
  </Route>,
  ...Admin
]
);
