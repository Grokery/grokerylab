import * as ActionTypes from '../actions'

export const logs = (state = [], action) => {
    if (action.type === ActionTypes.FETCHLOGS_SUCCESS) {
        return action.response.Items
    } else if (action.type === ActionTypes.APPENDLOGS_SUCCESS) {
        return state.concat([action.response.Item])
    }
    return state
}
