import * as ActionTypes from 'store/actions'

export const comments = (state = {}, action) => {
    if (action.type === ActionTypes.CREATECOMMENT_SUCCESS) {
        // TODO
    } else if (action.type === ActionTypes.QUERYCOMMENTS_SUCCESS) {
        if (action.response.data && action.response.data[0]) {
            let newState = Object.assign({}, state)
            newState[action.response.data[0].nodeId] = action.response.data
            state = newState
        }
    }
    return state
}
