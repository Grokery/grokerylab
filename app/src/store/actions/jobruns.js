import { CALL_CLOUD_API } from 'store/middleware/api'

//--------------------------------

export const CREATEEJOBRUN_REQUEST = 'CREATEEJOBRUN_REQUEST'
export const CREATEJOBRUN_SUCCESS = 'CREATEJOBRUN_SUCCESS'
export const CREATEJOBRUN_FAILURE = 'CREATEJOBRUN_FAILURE'

export const postJobRun = (data, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_CLOUD_API]: {
            types: [CREATEEJOBRUN_REQUEST, CREATEJOBRUN_SUCCESS, CREATEJOBRUN_FAILURE],
            endpoint: '/jobruns',
            method: 'POST',
            data: data,
            callback: cb
        }
    })
}
