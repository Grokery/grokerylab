import { FETCHOPTIONS_SUCCESS } from 'store/actions/options'

export const options = (state = {}, action) => {
    if (action.type === FETCHOPTIONS_SUCCESS) {
        return action.response
    }
    return state
}
