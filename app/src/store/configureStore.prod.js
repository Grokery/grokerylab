import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { grokeryApi } from './middleware/api'
import rootReducer from './reducers'

const configureStore = preloadedState => createStore(
  rootReducer,
  preloadedState,
  compose(
    applyMiddleware(thunk, grokeryApi)
  )
)

export default configureStore
