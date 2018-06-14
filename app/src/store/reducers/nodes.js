import * as ActionTypes from '../actions'

export const nodes = (state = {}, action) => {
    var newState = state
    if (action.type === ActionTypes.FETCHNODES_SUCCESS) {
        newState = action.response
    } else if (action.type === ActionTypes.CREATENODE_SUCCESS ||
        action.type === ActionTypes.UPDATENODE_SUCCESS) {
        let foo = Object.assign({}, state)
        foo[action.response.guid] = action.response
        newState = foo
    } else if (action.type === ActionTypes.DELETEENODE_SUCCESS) {
        let foo = Object.assign({}, state)
        delete foo[action.response.guid]
        newState = foo
    } else if (action.type === ActionTypes.CLEAR_NODES) {
        newState = {}
    }
    return newState
}

