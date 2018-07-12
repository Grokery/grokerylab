import { CALL_CLOUD_API } from 'store/middleware/api'

//--------------------------------

export const FETCHOPTIONS_REQUEST = 'FETCHOPTIONS_REQUEST'
export const FETCHOPTIONS_SUCCESS = 'FETCHOPTIONS_SUCCESS'
export const FETCHOPTIONS_FAILURE = 'FETCHOPTIONS_FAILURE'

export const fetchOptions = (cb) => (dispatch, getState) => {
    dispatch({
        [CALL_CLOUD_API]: {
            types: [FETCHOPTIONS_REQUEST, FETCHOPTIONS_SUCCESS, FETCHOPTIONS_FAILURE],
            endpoint: '/options',
            method: 'GET',
            callback: cb
        }
    })
}
