import { CALL_GROKERY_API } from '../middleware/api'

//--------------------------------

export const CREATEECLOUD_REQUEST = 'CREATEECLOUD_REQUEST'
export const CREATECLOUD_SUCCESS = 'CREATECLOUD_SUCCESS'
export const CREATECLOUD_FAILURE = 'CREATECLOUD_FAILURE'

export const createCloud = (data, cb) => (dispatch, getState) => {
    console.log(data)
    dispatch({
        [CALL_GROKERY_API]: {
            types: [CREATEECLOUD_REQUEST, CREATECLOUD_SUCCESS, CREATECLOUD_FAILURE],
            endpoint: '/clouds',
            method: 'POST',
            data: data,
            callback: cb
        }
    })
}

//--------------------------------

export const FETCHCLOUD_REQUEST = 'FETCHCLOUD_REQUEST'
export const FETCHCLOUD_SUCCESS = 'FETCHCLOUD_SUCCESS'
export const FETCHCLOUD_FAILURE = 'FETCHCLOUD_FAILURE'

export const fetchCloud = (cloudId, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_GROKERY_API]: {
            types: [FETCHCLOUD_REQUEST, FETCHCLOUD_SUCCESS, FETCHCLOUD_FAILURE],
            endpoint: '/clouds/' + cloudId,
            method: 'GET',
            callback: cb
        }
    })
}

// //--------------------------------

// export const UPDATECLOUD_REQUEST = 'UPDATECLOUD_REQUEST'
// export const UPDATECLOUD_SUCCESS = 'UPDATECLOUD_SUCCESS'
// export const UPDATECLOUD_FAILURE = 'UPDATECLOUD_FAILURE'

// export const updateNode = (collection, node, cb) => (dispatch, getState) => {
//     dispatch({
//         [CALL_CLOUD_API]: {
//             types: [UPDATECLOUD_REQUEST, UPDATECLOUD_SUCCESS, UPDATECLOUD_FAILURE],
//             endpoint: '/clouds/1/resources/' + collection + "/" + node.id,
//             method: 'PUT',
//             data: node,
//             callback: cb
//         }
//     })
// }

// //--------------------------------

// export const DELETEECLOUD_REQUEST = 'DELETEECLOUD_REQUEST'
// export const DELETEECLOUD_SUCCESS = 'DELETEECLOUD_SUCCESS'
// export const DELETEECLOUD_FAILURE = 'DELETEECLOUD_FAILURE'

// export const deleteNode = (collection, node, cb) => (dispatch, getState) => {
//     dispatch({
//         [CALL_CLOUD_API]: {
//             types: [DELETEECLOUD_REQUEST, DELETEECLOUD_SUCCESS, DELETEECLOUD_FAILURE],
//             endpoint: '/clouds/1/resources/' + collection + "/" + node.id,
//             method: 'DELETE',
//             callback: cb
//         }
//     })
// }