import { CALL_API } from '../middleware/api'


//--------------------------------

export const FETCHNODES_REQUEST = 'FETCHNODES_REQUEST'
export const FETCHNODES_SUCCESS = 'FETCHNODES_SUCCESS'
export const FETCHNODES_FAILURE = 'FETCHNODES_FAILURE'

export const fetchNodes = (cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [FETCHNODES_REQUEST, FETCHNODES_SUCCESS, FETCHNODES_FAILURE],
            endpoint: '/dataflowservice',
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

//--------------------------------

export const FETCHNODE_REQUEST = 'FETCHNODE_REQUEST'
export const FETCHNODE_SUCCESS = 'FETCHNODE_SUCCESS'
export const FETCHNODE_FAILURE = 'FETCHNODE_FAILURE'

export const fetchNode = (collection, nodeId, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [FETCHNODE_REQUEST, FETCHNODE_SUCCESS, FETCHNODE_FAILURE],
            endpoint: '/nodes/' + collection + "/" + nodeId,
            method: 'GET',
            callback: cb
        }
    })
}

//--------------------------------

export const UPDATENODE_REQUEST = 'UPDATENODE_REQUEST'
export const UPDATENODE_SUCCESS = 'UPDATENODE_SUCCESS'
export const UPDATENODE_FAILURE = 'UPDATENODE_FAILURE'

export const updateNode = (collection, node, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [UPDATENODE_REQUEST, UPDATENODE_SUCCESS, UPDATENODE_FAILURE],
            endpoint: '/nodes/' + collection + "/" + node.id,
            method: 'PUT',
            data: node,
            callback: cb
        }
    })
}

//--------------------------------

export const CREATEENODE_REQUEST = 'CREATEENODE_REQUEST'
export const CREATENODE_SUCCESS = 'CREATENODE_SUCCESS'
export const CREATENODE_FAILURE = 'CREATENODE_FAILURE'

export const createNode = (collection, node, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [CREATEENODE_REQUEST, CREATENODE_SUCCESS, CREATENODE_FAILURE],
            endpoint: '/nodes/' + collection,
            method: 'POST',
            data: node,
            callback: cb
        }
    })
}

//--------------------------------

export const DELETEENODE_REQUEST = 'DELETEENODE_REQUEST'
export const DELETEENODE_SUCCESS = 'DELETEENODE_SUCCESS'
export const DELETEENODE_FAILURE = 'DELETEENODE_FAILURE'

export const deleteNode = (collection, node, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [DELETEENODE_REQUEST, DELETEENODE_SUCCESS, DELETEENODE_FAILURE],
            endpoint: '/nodes/' + collection + "/" + node.id,
            method: 'DELETE',
            callback: cb
        }
    })
}