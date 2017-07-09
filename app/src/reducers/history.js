import * as ActionTypes from '../actions'

export const history = (state = [], action) => {
    if (action.type === ActionTypes.FETCHHISTORY_SUCCESS) {
        return action.response.Items
    } else if (action.type === ActionTypes.APPENDHISTORY_SUCCESS) {
        return state.concat([action.response.Item])
    }
    return state
}
