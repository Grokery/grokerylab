import React from 'react'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { render } from 'react-dom'
import { useRouterHistory, Router } from 'react-router'
import { createHashHistory } from 'react-router/node_modules/history'
import './styles/core.css'

// Set up redux store
import configureStore from './store/configureStore'
export const store = configureStore()

// Set up router history
const appHistory = useRouterHistory(createHashHistory)()
export const history = syncHistoryWithStore(appHistory, store)
history.listen((location) => {
  window.scrollTo(0,0)
})

// Set up routes
import routes from './routes'

// Render root
render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>, 
  document.getElementById('react-root')
)