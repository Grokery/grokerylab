import { CALL_CLOUD_API } from '../middleware/api'
import { getSelectedCloudId } from '../authentication'


//--------------------------------

export const FETCHLOOKUPS_REQUEST = 'FETCHLOOKUPS_REQUEST'
export const FETCHLOOKUPS_SUCCESS = 'FETCHLOOKUPS_SUCCESS'
export const FETCHLOOKUPS_FAILURE = 'FETCHLOOKUPS_FAILURE'

export const fetchLookupData = (cb) => (dispatch, getState) => {
    dispatch({
        [CALL_CLOUD_API]: {
            types: [FETCHLOOKUPS_REQUEST, FETCHLOOKUPS_SUCCESS, FETCHLOOKUPS_FAILURE],
            endpoint: '/clouds/' + getSelectedCloudId() + '/definitionservice',
            method: 'GET',
            callback: cb
        }
    })
}
