import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from "./layout"
import Author from "./author"
import Book from "./book"
import Volume from "./volume"
import DashBoard from "./dashboard"


export default (
[
  <Route key="AdminLayout" path="/admin" component={Layout}>
    <Route path="author" component={Author} />
    <Route path="book" component={Book} />
    <Route path="volume" component={Volume} />
    <IndexRoute component={DashBoard} />
  </Route>,
]
);
