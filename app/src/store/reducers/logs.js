import { FETCHLOGS_SUCCESS, APPENDLOGS_SUCCESS } from 'store/actions/logs'

export const logs = (state = [], action) => {
    if (action.type === FETCHLOGS_SUCCESS) {
        return action.response
    } else if (action.type === APPENDLOGS_SUCCESS) {
        return state.concat([action.response])
    }
    return state
}
