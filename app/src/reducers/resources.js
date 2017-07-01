import * as ActionTypes from '../actions'
import _ from 'lodash'

export const nodes = (state = {}, action) => {
    if (action.type === ActionTypes.FETCHNODES_SUCCESS) {
        return _.merge({}, state, action.response.Items)
    } else if (action.type === ActionTypes.FETCHNODE_SUCCESS || 
        action.type === ActionTypes.CREATENODE_SUCCESS || 
        action.type === ActionTypes.UPDATENODE_SUCCESS) {
        let foo = Object.assign({}, state)
        foo[action.response.Item.id] = action.response.Item
        return foo
    } else if (action.type === ActionTypes.DELETEENODE_SUCCESS) {
        let foo = Object.assign({}, state)
        delete foo[action.response.Item.id]
        return foo
    } else if (action.type === ActionTypes.CLEAR_NODES) {
        return {}
    } 
    return state
}
