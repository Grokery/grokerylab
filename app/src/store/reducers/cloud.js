import { FETCHCLOUD_SUCCESS } from 'store/actions/cloud'

export const cloud = (state = null, action) => {
    var newState = state
    if (action.type === FETCHCLOUD_SUCCESS) {
        newState = action.response
    }
    return newState
}
