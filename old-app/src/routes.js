import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'
import AuthGateway from './containers/AuthGateway'
import Auth from './containers/Auth'
import Account from './containers/Account'
import Home from './containers/Home'
import Cloud from './containers/Cloud'
import Dataflows from './containers/Dataflows'
import NodeDetails from './containers/NodeDetails'
import Config from './containers/Config'

export default <Route path="/" component={App}>
  <Route path="/signin" component={Auth} /> 
  <Route path="/signout" component={Auth} /> 
  <Route component={AuthGateway}>
    <IndexRoute component={Home} />
    <Route path="/account" component={Account} /> 
    <Route path="/clouds/:cloudId" component={Cloud}>
      <IndexRoute component={Dataflows}></IndexRoute>
      <Route path="/clouds/:cloudId/configuration" component={Config} />
      <Route path="/clouds/:cloudId/flow" component={Dataflows} />
      <Route path="/clouds/:cloudId/flow/:nodeId" component={Dataflows} />
      <Route path="/clouds/:cloudId/:collection/:nodeId" component={NodeDetails} />
    </Route>
  </Route>
</Route>
