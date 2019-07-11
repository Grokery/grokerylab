import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
// import createLogger from 'redux-logger'

import { apiMiddleware } from './middleware/api'

import appStatus from 'store/reducers/app'
import cloud from 'store/reducers/cloud'
import comments from 'store/reducers/comments'
import errorMessage from 'store/reducers/errors'
import jobruns from 'store/reducers/jobruns'
import { history } from 'store/reducers/history'
import { nodes } from 'store/reducers/nodes'
import { options } from 'store/reducers/options'

let rootReducer = combineReducers({
  appStatus,
  cloud,
  comments,
  errorMessage,
  jobruns,
  history,
  nodes,
  options,
})

let configureStore = null

if (process.env.NODE_ENV === 'production') {
  configureStore = preloadedState => createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(
        thunk,
        apiMiddleware,
      )
    )
  )
} else {
  configureStore = preloadedState => createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(
        thunk,
        apiMiddleware,
        // createLogger()
      )
    )
  )
}

export default configureStore
