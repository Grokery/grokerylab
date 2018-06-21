import * as ActionTypes from 'store/actions'

export const cloudDetails = (state = null, action) => {
    var newState = state
    if (action.type === ActionTypes.FETCHCLOUD_SUCCESS) {
        newState = action.response
    }
    return newState
}
