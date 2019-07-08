import { API_BASE_URL } from "config"
import { CALL_API } from 'store/middleware/api'
import { getCloudId, getCloudToken } from 'authentication'

//--------------------------------

export const FETCHOPTIONS_REQUEST = 'FETCHOPTIONS_REQUEST'
export const FETCHOPTIONS_SUCCESS = 'FETCHOPTIONS_SUCCESS'
export const FETCHOPTIONS_FAILURE = 'FETCHOPTIONS_FAILURE'

export const fetchOptions = (cloudName, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [FETCHOPTIONS_REQUEST, FETCHOPTIONS_SUCCESS, FETCHOPTIONS_FAILURE],
            endpoint: `${API_BASE_URL}/clouds/${getCloudId(cloudName)}/options`,
            method: 'GET',
            token: getCloudToken(cloudName),
            callback: cb
        }
    })
}
