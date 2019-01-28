import { FETCHCLOUD_SUCCESS } from 'store/actions/cloud'

export default (state = null, action) => {
    var newState = state
    if (action.type === FETCHCLOUD_SUCCESS) {
        newState = action.response
    }
    return newState
}
