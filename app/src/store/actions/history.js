import { CALL_API } from 'store/middleware/api'
import { getCloudToken, getCloudId, getCloudBaseUrl } from 'authentication'

//--------------------------------

export const FETCHHISTORY_REQUEST = 'FETCHHISTORY_REQUEST'
export const FETCHHISTORY_SUCCESS = 'FETCHHISTORY_SUCCESS'
export const FETCHHISTORY_FAILURE = 'FETCHHISTORY_FAILURE'

export const fetchNodeHistory = (cloudName, nodeId, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [FETCHHISTORY_REQUEST, FETCHHISTORY_SUCCESS, FETCHHISTORY_FAILURE],
            endpoint: `${getCloudBaseUrl(cloudName)}/clouds/${getCloudId(cloudName)}/history/search?nodeId=${nodeId}&limit=30`,
            method: 'GET',
            token: getCloudToken(cloudName),
            callback: cb
        }
    })
}
