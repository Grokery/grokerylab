import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { cloudApi, grokeryApi } from './middleware/api'
import rootReducer from './reducers'

const configureStore = preloadedState => createStore(
  rootReducer,
  preloadedState,
  compose(
    applyMiddleware(thunk, grokeryApi),
    applyMiddleware(thunk, cloudApi)
  )
)

export default configureStore
