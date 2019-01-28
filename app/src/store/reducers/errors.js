import { RESET_ERROR_MESSAGE } from 'store/actions/errors'

export default (state = null, action) => {
    const { type, error } = action

    if (type === RESET_ERROR_MESSAGE) {
        return null
    } else if (error) {
        return action.error
    }

    return state
}