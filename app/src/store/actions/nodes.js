import { CALL_API } from 'store/middleware/api'
import { getCloudId, getCloudToken } from 'authentication'

//--------------------------------

export const FETCHNODES_REQUEST = 'FETCHNODES_REQUEST'
export const FETCHNODES_SUCCESS = 'FETCHNODES_SUCCESS'
export const FETCHNODES_FAILURE = 'FETCHNODES_FAILURE'

export const fetchNodes = (cloudName, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [FETCHNODES_REQUEST, FETCHNODES_SUCCESS, FETCHNODES_FAILURE],
            endpoint: '/clouds/' + getCloudId(cloudName) + '/nodes/search',
            method: 'GET',
            token: getCloudToken(cloudName),
            callback: cb
        }
    })
}

//--------------------------------

export const CLEAR_NODES = 'CLEAR_NODES'

export const clearNodes = () => (dispatch, getState) => {
    dispatch({
        type: CLEAR_NODES
    })
}
