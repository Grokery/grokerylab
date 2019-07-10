import { API_BASE_URL } from "config"
import { CALL_API } from 'store/middleware/api'
import { getCloudId, getAccountToken } from 'authentication'

//--------------------------------

export const CREATEECLOUD_REQUEST = 'CREATEECLOUD_REQUEST'
export const CREATECLOUD_SUCCESS = 'CREATECLOUD_SUCCESS'
export const CREATECLOUD_FAILURE = 'CREATECLOUD_FAILURE'

export const createCloud = (data, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [CREATEECLOUD_REQUEST, CREATECLOUD_SUCCESS, CREATECLOUD_FAILURE],
            endpoint: `${API_BASE_URL}/clouds`,
            method: 'POST',
            token: getAccountToken(),
            data: data,
            callback: cb
        }
    })
}

//--------------------------------

export const FETCHCLOUD_REQUEST = 'FETCHCLOUD_REQUEST'
export const FETCHCLOUD_SUCCESS = 'FETCHCLOUD_SUCCESS'
export const FETCHCLOUD_FAILURE = 'FETCHCLOUD_FAILURE'

export const fetchCloud = (cloudName, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [FETCHCLOUD_REQUEST, FETCHCLOUD_SUCCESS, FETCHCLOUD_FAILURE],
            endpoint: `${API_BASE_URL}/clouds/${getCloudId(cloudName)}`,
            method: 'GET',
            token: getAccountToken(),
            callback: cb
        }
    })
}

// //--------------------------------

export const UPDATECLOUD_REQUEST = 'UPDATECLOUD_REQUEST'
export const UPDATECLOUD_SUCCESS = 'UPDATECLOUD_SUCCESS'
export const UPDATECLOUD_FAILURE = 'UPDATECLOUD_FAILURE'

export const updateCloud = (cloudName, data, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [UPDATECLOUD_REQUEST, UPDATECLOUD_SUCCESS, UPDATECLOUD_FAILURE],
            endpoint: `${API_BASE_URL}/clouds/${getCloudId(cloudName)}`,
            method: 'PUT',
            token: getAccountToken(),
            data: data,
            callback: cb
        }
    })
}

//--------------------------------

export const DELETEECLOUD_REQUEST = 'DELETEECLOUD_REQUEST'
export const DELETEECLOUD_SUCCESS = 'DELETEECLOUD_SUCCESS'
export const DELETEECLOUD_FAILURE = 'DELETEECLOUD_FAILURE'

export const deleteCloud = (cloudName, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [DELETEECLOUD_REQUEST, DELETEECLOUD_SUCCESS, DELETEECLOUD_FAILURE],
            endpoint: `${API_BASE_URL}/clouds/${getCloudId(cloudName)}`,
            method: 'DELETE',
            token: getAccountToken(),
            callback: cb
        }
    })
}