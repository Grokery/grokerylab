import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { useRouterHistory, Router } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { createHashHistory } from 'react-router/node_modules/history'
import routes from './routes'

// Set up redux store
import configureStore from './store/configureStore'
export const store = configureStore()

// Set up router history
const appHistory = useRouterHistory(createHashHistory)()
export const history = syncHistoryWithStore(appHistory, store)

// This hooks into the navigation event and scrolls page to top 
history.listen((location) => {
  window.scrollTo(0,0)
})

// Render root
render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>, 
  document.getElementById('react-root')
)