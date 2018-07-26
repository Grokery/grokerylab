import { CALL_CLOUD_API } from 'store/middleware/api'

//--------------------------------

export const CREATEJOBRUN_REQUEST = 'CREATEJOBRUN_REQUEST'
export const CREATEJOBRUN_SUCCESS = 'CREATEJOBRUN_SUCCESS'
export const CREATEJOBRUN_FAILURE = 'CREATEJOBRUN_FAILURE'

export const postJobRun = (data, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_CLOUD_API]: {
            types: [CREATEJOBRUN_REQUEST, CREATEJOBRUN_SUCCESS, CREATEJOBRUN_FAILURE],
            endpoint: '/jobruns',
            method: 'POST',
            data: data,
            callback: cb
        }
    })
}

//--------------------------------

export const FETCHJOBRUNS_REQUEST = 'FETCHJOBRUNS_REQUEST'
export const FETCHJOBRUNS_SUCCESS = 'FETCHJOBRUNS_SUCCESS'
export const FETCHJOBRUNS_FAILURE = 'FETCHJOBRUNS_FAILURE'

export const fetchJobRuns = (jobId, query, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_CLOUD_API]: {
            types: [FETCHJOBRUNS_REQUEST, FETCHJOBRUNS_SUCCESS, FETCHJOBRUNS_FAILURE],
            endpoint: '/jobruns/' + jobId + (query ? query : ''),
            method: 'GET',
            callback: cb
        }
    })
}
