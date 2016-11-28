import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from "./layout"
import Teacher from "./teacher"
import Student from "./student"
import Location from "./location"
import DashBoard from "./dashboard"

import { BASE } from "./config"

export { BASE }

export default (
[
  <Route key="AdminLayout" path={BASE} component={Layout}>
    <Route path="teacher" component={Teacher} />
    <Route path="student" component={Student} />
    <Route path="location" component={Location} />
    <IndexRoute component={DashBoard} />
  </Route>,
]
);
