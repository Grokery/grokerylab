import React from 'react'
import { Route, IndexRoute } from 'react-router'

import Account from './components/Account/Account'
import App from './components/App/App'
import Auth from './components/Auth/Auth'
import AuthGateway from './components/AuthGateway/AuthGateway'
import Cloud from './components/Cloud/Cloud'
// import CloudHome from './components/CloudHome/CloudHome'
import Boards from './components/Boards/Boards'
import Board from './components/Boards/Board'
import Dataflows from './components/Dataflows/Dataflows'
import Home from './components/Home/Home'
import NodeDetails from './components/NodeDetails/NodeDetails'
import Users from './components/Cloud/Users'

export default <Route path='/' component={App}>
  <Route path='/signin' component={Auth} />
  <Route path='/signout' component={Auth} />
  <Route component={AuthGateway}>
    <IndexRoute component={Home} />
    <Route path='/account' component={Account} />
    <Route path='/clouds/:cloudName' component={Cloud}>
      <IndexRoute component={Boards}></IndexRoute>
      <Route path='/clouds/:cloudName/boards' component={Boards} />
      <Route path='/clouds/:cloudName/boards/:boardId' component={Board} />
      <Route path='/clouds/:cloudName/flows' component={Dataflows} />
      <Route path='/clouds/:cloudName/flows/:nodeType/:nodeId' component={NodeDetails} />
      <Route path='/clouds/:cloudName/users' component={Users} />
    </Route>
  </Route>
</Route>
