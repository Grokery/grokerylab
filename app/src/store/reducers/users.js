import { FETCHUSERS_SUCCESS } from 'store/actions/users'

export const users = (state = [], action) => {
    if (action.type === FETCHUSERS_SUCCESS) {
        return action.response.data
    }
    return state
}
