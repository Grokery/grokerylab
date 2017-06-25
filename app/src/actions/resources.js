import { CALL_API } from '../middleware/api'


//--------------------------------

export const FETCHNODES_REQUEST = 'FETCHNODES_REQUEST'
export const FETCHNODES_SUCCESS = 'FETCHNODES_SUCCESS'
export const FETCHNODES_FAILURE = 'FETCHNODES_FAILURE'

export const fetchNodes = () => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [FETCHNODES_REQUEST, FETCHNODES_SUCCESS, FETCHNODES_FAILURE],
            endpoint: '/dataflowservice',
            method: 'GET'
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

//--------------------------------

export const FETCHNODE_REQUEST = 'FETCHNODE_REQUEST'
export const FETCHNODE_SUCCESS = 'FETCHNODE_SUCCESS'
export const FETCHNODE_FAILURE = 'FETCHNODE_FAILURE'

export const fetchNode = (collection, nodeId) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [FETCHNODE_REQUEST, FETCHNODE_SUCCESS, FETCHNODE_FAILURE],
            endpoint: '/resources/' + collection + "/" + nodeId,
            method: 'GET'
        }
    })
}

//--------------------------------

export const UPDATENODE_REQUEST = 'UPDATENODE_REQUEST'
export const UPDATENODE_SUCCESS = 'UPDATENODE_SUCCESS'
export const UPDATENODE_FAILURE = 'UPDATENODE_FAILURE'

export const updateNode = (collection, node) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [UPDATENODE_REQUEST, UPDATENODE_SUCCESS, UPDATENODE_FAILURE],
            endpoint: '/resources/' + collection + "/" + node.id,
            method: 'PUT',
            data: node
        }
    })
}

//--------------------------------

export const SET_APPSTATUS = 'SET_APPSTATUS'

export const setAppStatus = (status) => (dispatch, getState) => {
    dispatch({
        type: SET_APPSTATUS,
        status: status
    })
}