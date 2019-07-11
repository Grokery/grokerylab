import { FETCHHISTORY_SUCCESS } from 'store/actions/history'

export const history = (state = [], action) => {
    if (action.type === FETCHHISTORY_SUCCESS) {
        return action.response.data
    }
    return state
}
