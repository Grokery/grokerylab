import { CALL_API } from 'store/middleware/api'
import { getCloudToken, getCloudId, getCloudBaseUrl } from 'authentication'

//--------------------------------

export const CREATEJOBRUN_REQUEST = 'CREATEJOBRUN_REQUEST'
export const CREATEJOBRUN_SUCCESS = 'CREATEJOBRUN_SUCCESS'
export const CREATEJOBRUN_FAILURE = 'CREATEJOBRUN_FAILURE'

export const postJobRun = (cloudName, data, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [CREATEJOBRUN_REQUEST, CREATEJOBRUN_SUCCESS, CREATEJOBRUN_FAILURE],
            endpoint: `${getCloudBaseUrl(cloudName)}/clouds/${getCloudId(cloudName)}/jobruns`,
            method: 'POST',
            token: getCloudToken(cloudName),
            data: data,
            callback: cb
        }
    })
}

//--------------------------------

export const UPDATEJOBRUN_REQUEST = 'UPDATEJOBRUN_REQUEST'
export const UPDATEJOBRUN_SUCCESS = 'UPDATEJOBRUN_SUCCESS'
export const UPDATEJOBRUN_FAILURE = 'UPDATEJOBRUN_FAILURE'

export const updateJobRun = (cloudName, nodeId, created, data, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [UPDATEJOBRUN_REQUEST, UPDATEJOBRUN_SUCCESS, UPDATEJOBRUN_FAILURE],
            endpoint: `${getCloudBaseUrl(cloudName)}/clouds/${getCloudId(cloudName)}/jobruns/${nodeId}/${created}`,
            method: 'PUT',
            token: getCloudToken(cloudName),
            data: data,
            callback: cb
        }
    })
}

//--------------------------------

export const FETCHJOBRUNS_REQUEST = 'FETCHJOBRUNS_REQUEST'
export const FETCHJOBRUNS_SUCCESS = 'FETCHJOBRUNS_SUCCESS'
export const FETCHJOBRUNS_FAILURE = 'FETCHJOBRUNS_FAILURE'

export const fetchJobRuns = (cloudName, query, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [FETCHJOBRUNS_REQUEST, FETCHJOBRUNS_SUCCESS, FETCHJOBRUNS_FAILURE],
            endpoint: `${getCloudBaseUrl(cloudName)}/clouds/${getCloudId(cloudName)}/jobruns/search${(query ? query : '')}`,
            method: 'GET',
            token: getCloudToken(cloudName),
            callback: cb
        }
    })
}

// schedules example: [[1, 0.0, 5], [1, 2.0, 5], [30, 0.0, 120], ... ]
// given schedule [a, b, c] delay calculated in seconds as: delay_i = a + b*i for i=1 to i=c
export const fetchJobRunsWithRepeat = (cloudName, query, cb, schedules) => (dispatch, getState) => {
    var iter = 1
    var count = 1
    let run = function () {
        dispatch({
            [CALL_API]: {
                types: [FETCHJOBRUNS_REQUEST, FETCHJOBRUNS_SUCCESS, FETCHJOBRUNS_FAILURE],
                endpoint: `${getCloudBaseUrl(cloudName)}/clouds/${getCloudId(cloudName)}/jobruns/search${(query ? query : '')}`,
                method: 'GET',
                token: getCloudToken(cloudName),
                callback: cb
            }
        })
        if (count >= schedules[iter-1][2]) {
            iter += 1
            if (iter > schedules.length) {
                return
            }
            count = 1
        }
        var seconds = schedules[iter-1][0] + schedules[iter-1][1] * count
        setTimeout(run, seconds * 1000)
        count += 1
    }
    run()
}
