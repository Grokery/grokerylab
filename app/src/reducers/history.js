import * as ActionTypes from '../actions'

export const history = (state = {}, action) => {
    if (action.type === ActionTypes.FETCHLINES_SUCCESS) {
        // TODO data from response
        return state
    } else if (action.type === ActionTypes.APPENDLINE_SUCCESS) {
        return state
    }
    return state
}
