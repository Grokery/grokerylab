import { CALL_API } from 'store/middleware/api'
import { getAccountToken } from 'authentication'

//--------------------------------

export const CREATEJOBRUN_REQUEST = 'CREATEJOBRUN_REQUEST'
export const CREATEJOBRUN_SUCCESS = 'CREATEJOBRUN_SUCCESS'
export const CREATEJOBRUN_FAILURE = 'CREATEJOBRUN_FAILURE'

export const postJobRun = (data, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [CREATEJOBRUN_REQUEST, CREATEJOBRUN_SUCCESS, CREATEJOBRUN_FAILURE],
            endpoint: '/jobruns',
            method: 'POST',
            token: getAccountToken(),
            data: data,
            callback: cb
        }
    })
}

//--------------------------------

export const FETCHJOBRUNS_REQUEST = 'FETCHJOBRUNS_REQUEST'
export const FETCHJOBRUNS_SUCCESS = 'FETCHJOBRUNS_SUCCESS'
export const FETCHJOBRUNS_FAILURE = 'FETCHJOBRUNS_FAILURE'

// schedules example: [[1, 0.0, 5], [1, 2.0, 5], [30, 0.0, 120], ... ]
// given schedule [a, b, c] delay calculated in seconds as: delay_i = a + b*i for i=1 to i=c
export const fetchJobRunsWithRepeat = (query, cb, schedules) => (dispatch, getState) => {
    var iter = 1
    var count = 1
    let run = function () {
        dispatch({
            [CALL_API]: {
                types: [FETCHJOBRUNS_REQUEST, FETCHJOBRUNS_SUCCESS, FETCHJOBRUNS_FAILURE],
                endpoint: '/jobruns/search' + (query ? query : ''),
                method: 'GET',
                token: getAccountToken(),
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

export const fetchJobRuns = (query, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [FETCHJOBRUNS_REQUEST, FETCHJOBRUNS_SUCCESS, FETCHJOBRUNS_FAILURE],
            endpoint: '/jobruns/search' + (query ? query : ''),
            method: 'GET',
            token: getAccountToken(),
            callback: cb
        }
    })
}