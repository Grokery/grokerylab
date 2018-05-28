import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from './components/App/App'
import AuthGateway from './components/AuthGateway/AuthGateway'
import Auth from './components/Auth/Auth'
import Account from './components/Account/Account'
import Home from './components/Home/Home'

import Cloud from './components/Cloud'
// import CloudHome from './components/CloudHome'
import Dataflows from './components/Dataflows'
import NodeDetails from './components/NodeDetails'
import Connections from './components/Connections'
import Sources from './components/Sources'
import Jobs from './components/Jobs'
import Users from './components/Users'
import Settings from './components/Settings'

export default <Route path="/" component={App}>
  <Route path="/signin" component={Auth} /> 
  <Route path="/signout" component={Auth} /> 
  <Route component={AuthGateway}>
    <IndexRoute component={Home} />
    <Route path="/account" component={Account} /> 
    <Route path="/clouds/:cloudName" component={Cloud}>
      <IndexRoute component={Dataflows}></IndexRoute>
      <Route path="/clouds/:cloudName/connections" component={Connections} />
      <Route path="/clouds/:cloudName/datasources" component={Sources} />
      <Route path="/clouds/:cloudName/jobs" component={Jobs} />
      <Route path="/clouds/:cloudName/users" component={Users} />
      <Route path="/clouds/:cloudName/settings" component={Settings} />
      <Route path="/clouds/:cloudName/flow" component={Dataflows} />
      <Route path="/clouds/:cloudName/flow/:nodeId" component={Dataflows} />
      <Route path="/clouds/:cloudName/:collection/:nodeId" component={NodeDetails} />
    </Route>
  </Route>
</Route>
