import * as ActionTypes from '../actions'

export const cloud = (state = null, action) => {
    var newState = state
    if (action.type === ActionTypes.FETCHCLOUD_SUCCESS) {
        newState = action.response
    }
    return newState
}
