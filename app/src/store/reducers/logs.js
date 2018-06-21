import * as ActionTypes from 'store/actions'

export const logs = (state = [], action) => {
    if (action.type === ActionTypes.FETCHLOGS_SUCCESS) {
        return action.response
    } else if (action.type === ActionTypes.APPENDLOGS_SUCCESS) {
        return state.concat([action.response])
    }
    return state
}
