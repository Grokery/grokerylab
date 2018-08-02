import * as ActionTypes from 'store/actions'

export const jobruns = (state = {}, action) => {
    if (action.type === ActionTypes.CREATEJOBRUN_SUCCESS) {
        // TODO
    } else if (action.type === ActionTypes.FETCHJOBRUNS_SUCCESS) {
        if (action.response.data && action.response.data[0]) {
            let newState = Object.assign({}, state)
            newState[action.response.data[0].jobId] = action.response.data
            state = newState
        }
    }
    return state
}
