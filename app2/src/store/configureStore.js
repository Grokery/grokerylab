import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
// import createLogger from 'redux-logger'

import { grokeryApi } from './middleware/api'

import { appStatus }  from 'store/reducers/app'
import { cloud } from 'store/reducers/cloud'
import { comments } from 'store/reducers/comments'
import { errorMessage } from 'store/reducers/errors'
import { jobruns } from 'store/reducers/jobruns'
import { logs } from 'store/reducers/logs'
import { nodes } from 'store/reducers/nodes'
import { options } from 'store/reducers/options'

let rootReducer = combineReducers({
  appStatus,
  cloud,
  comments,
  errorMessage,
  jobruns,
  logs,
  nodes,
  options,
})

let configureStore = null

if (process.env.NODE_ENV === 'production') {
  configureStore = preloadedState => createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(thunk, grokeryApi)
    )
  )
} else {
  configureStore = preloadedState => createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(
        thunk, 
        grokeryApi, 
        // createLogger()
      )
    )
  )
}

export default configureStore
