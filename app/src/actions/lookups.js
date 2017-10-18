import { CALL_API } from '../middleware/api'


//--------------------------------

export const FETCHLOOKUPS_REQUEST = 'FETCHLOOKUPS_REQUEST'
export const FETCHLOOKUPS_SUCCESS = 'FETCHLOOKUPS_SUCCESS'
export const FETCHLOOKUPS_FAILURE = 'FETCHLOOKUPS_FAILURE'

export const fetchLookupData = (cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [FETCHLOOKUPS_REQUEST, FETCHLOOKUPS_SUCCESS, FETCHLOOKUPS_FAILURE],
            endpoint: '/definitions',
            method: 'GET',
            callback: cb
        }
    })
}
