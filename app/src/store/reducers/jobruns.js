import { CREATEJOBRUN_SUCCESS, FETCHJOBRUNS_SUCCESS } from 'store/actions/jobruns'

export default (state = {}, action) => {
    if (action.type === CREATEJOBRUN_SUCCESS) {
        // TODO
    } else if (action.type === FETCHJOBRUNS_SUCCESS) {
        if (action.response.data && action.response.data[0]) {
            let newState = Object.assign({}, state)
            newState[action.response.data[0].jobId] = action.response.data
            state = newState
        }
    }
    return state
}
