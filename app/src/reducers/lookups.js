import * as ActionTypes from '../actions'

export const lookups = (state = null, action) => {
    if (action.type === ActionTypes.FETCHLOOKUPS_SUCCESS) {
        return action.response
    }
    return state
}
