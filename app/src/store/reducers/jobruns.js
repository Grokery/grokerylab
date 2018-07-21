import * as ActionTypes from 'store/actions'

export const jobruns = (state = {}, action) => {
    var newState = state
    if (action.type === ActionTypes.FETCHJOBRUNS_SUCCESS) {
        if (action.response.data) {
            let foo = Object.assign({}, state)
            foo[action.response.data[0].jobId] = action.response.data
            newState = foo
        }
    }
    return newState
}
