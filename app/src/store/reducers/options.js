import * as ActionTypes from 'store/actions'

export const options = (state = {}, action) => {
    if (action.type === ActionTypes.FETCHOPTIONS_SUCCESS) {
        return action.response
    }
    return state
}

