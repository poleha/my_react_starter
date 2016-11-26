import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'
import Registration from './containers/Registration'

export default (
  <Route path='/' component={App}>
      <Route path='/registration' component={Registration} />

  </Route>
)
