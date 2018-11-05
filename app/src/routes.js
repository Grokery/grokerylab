import React from 'react'
import { Route, IndexRoute } from 'react-router'

import Account from './components/Account/Account'
import App from './components/App/App'
import Auth from './components/Auth/Auth'
import AuthGateway from './components/AuthGateway/AuthGateway'
import Cloud from './components/Cloud/Cloud'
// import CloudHome from './components/CloudHome/CloudHome'
import Dataflows from './components/Dataflows/Dataflows'
import Home from './components/Home/Home'
import Jobs from './components/Jobs/Jobs'
import NodeDetails from './components/NodeDetails/NodeDetails'
import Users from './components/Users/Users'
import Sources from './components/Sources/Sources'

export default <Route path='/' component={App}>
  <Route path='/signin' component={Auth} />
  <Route path='/signout' component={Auth} />
  <Route component={AuthGateway}>
    <IndexRoute component={Home} />
    <Route path='/account' component={Account} />
    <Route path='/clouds/:cloudName' component={Cloud}>
      <IndexRoute component={Dataflows}></IndexRoute>
      <Route path='/clouds/:cloudName/datasources' component={Sources} />
      <Route path='/clouds/:cloudName/jobs' component={Jobs} />
      <Route path='/clouds/:cloudName/users' component={Users} />
      <Route path='/clouds/:cloudName/flows' component={Dataflows} />
      <Route path='/clouds/:cloudName/flows/:nodeId' component={Dataflows} />
      <Route path='/clouds/:cloudName/:nodeType/:nodeId' component={NodeDetails} />
    </Route>
  </Route>
</Route>
