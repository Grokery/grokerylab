import { combineReducers } from 'redux'
import merge from 'lodash/merge'
import { routerReducer as routing } from 'react-router-redux'

let reducers = {'routing':routing}
require.context('./', true, /\.js$/).keys().forEach(function(f) {
    if (f !== "./index.js") {
        reducers = merge(reducers, require(f))
    }
})

export default combineReducers(reducers)