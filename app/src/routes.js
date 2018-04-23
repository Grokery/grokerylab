import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'
import AuthGateway from './containers/AuthGateway'
import Auth from './containers/Auth'
import Account from './containers/Account'
import Home from './containers/Home'
import Cloud from './containers/Cloud'
// import CloudHome from './containers/CloudHome'
import Dataflows from './containers/Dataflows'
import NodeDetails from './containers/NodeDetails'
import Connections from './containers/Connections'
import Sources from './containers/Sources'
import Jobs from './containers/Jobs'
import Users from './containers/Users'
import Settings from './containers/Settings'

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
