import { CREATECOMMENT_SUCCESS, QUERYCOMMENTS_SUCCESS } from 'store/actions/comments'

export default (state = {}, action) => {
    if (action.type === CREATECOMMENT_SUCCESS) {
        // TODO
    } else if (action.type === QUERYCOMMENTS_SUCCESS) {
        if (action.response.data && action.response.data[0]) {
            let newState = Object.assign({}, state)
            newState[action.response.data[0].nodeId] = action.response.data
            state = newState
        }
    }
    return state
}
