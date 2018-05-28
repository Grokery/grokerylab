import { CALL_CLOUD_API } from '../middleware/api'
import { getSelectedCloudId } from '../../authentication'

//--------------------------------

export const FETCHNODES_REQUEST = 'FETCHNODES_REQUEST'
export const FETCHNODES_SUCCESS = 'FETCHNODES_SUCCESS'
export const FETCHNODES_FAILURE = 'FETCHNODES_FAILURE'

export const fetchNodes = (cb) => (dispatch, getState) => {
    dispatch({
        [CALL_CLOUD_API]: {
            types: [FETCHNODES_REQUEST, FETCHNODES_SUCCESS, FETCHNODES_FAILURE],
            endpoint: '/clouds/' + getSelectedCloudId() + '/dataflowservice',
            method: 'GET',
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

