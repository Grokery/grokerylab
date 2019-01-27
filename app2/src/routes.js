import React from 'react'
import { Route } from 'react-router'

import App from './components/App/App'
import Auth from './components/Auth/Auth'

import AuthGateway from './components/AuthGateway/AuthGateway'
import Home from './components/Home/Home'
import UserAccount from './components/UserAccount/UserAccount'
import Cloud from './components/Cloud/Cloud'
import Boards from './components/Boards/Boards'
import Board from './components/Boards/Board'
import Dataflows from './components/Dataflows/Dataflows'
import NodeDetails from './components/NodeDetails/NodeDetails'
import Users from './components/Cloud/Users'

export default <App>
    <Route path='/public' component={<div>public</div>} />
    <Route path='/signin' component={Auth} />
    <Route path='/signout' component={Auth} />
    <AuthGateway>
        <Route path='/home' component={Home} />
        <Route path='/account' component={UserAccount} />

        <Route path='/clouds/:cloudName' component={Cloud}>
          <Route component={Boards} />
          <Route path='/clouds/:cloudName/boards' component={Boards} />
          <Route path='/clouds/:cloudName/boards/:boardId' component={Board} />
          <Route path='/clouds/:cloudName/flows' component={Dataflows} />
          <Route path='/clouds/:cloudName/flows/:nodeType/:nodeId' component={NodeDetails} />
          <Route path='/clouds/:cloudName/users' component={Users} />
        </Route>

    </AuthGateway>
</App>