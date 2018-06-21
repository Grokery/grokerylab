import * as ActionTypes from 'store/actions'

export const nodeDetails = (state = null, action) => {
    var newState = state
    if (action.type === ActionTypes.FETCHNODE_SUCCESS ||
        action.type === ActionTypes.CREATENODE_SUCCESS ||
        action.type === ActionTypes.UPDATENODE_SUCCESS) {
        newState = action.response
    } else if (action.type === ActionTypes.DELETEENODE_SUCCESS) {
        newState = null
    }
    return newState
}

