import { API_BASE_URL } from "config"
import { CALL_API } from 'store/middleware/api'
import { getAccountToken } from 'authentication'

//--------------------------------

export const FETCHUSERS_REQUEST = 'FETCHUSERS_REQUEST'
export const FETCHUSERS_SUCCESS = 'FETCHUSERS_SUCCESS'
export const FETCHUSERS_FAILURE = 'FETCHUSERS_FAILURE'

export const fetchUsers = (cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [FETCHUSERS_REQUEST, FETCHUSERS_SUCCESS, FETCHUSERS_FAILURE],
            endpoint: `${API_BASE_URL}/users`,
            method: 'GET',
            token: getAccountToken(),
            callback: cb
        }
    })
}

//--------------------------------

export const CREATEUSER_REQUEST = 'CREATEUSER_REQUEST'
export const CREATEUSER_SUCCESS = 'CREATEUSER_SUCCESS'
export const CREATEUSER_FAILURE = 'CREATEUSER_FAILURE'

export const createUser = (data, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [CREATEUSER_REQUEST, CREATEUSER_SUCCESS, CREATEUSER_FAILURE],
            endpoint: `${API_BASE_URL}/users`,
            method: 'POST',
            token: getAccountToken(),
            data: data,
            callback: cb
        }
    })
}
